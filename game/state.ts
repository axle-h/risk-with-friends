import {
    Action, AttackAction,
    AttackTurnState,
    DeployAction,
    DeployTurnState, DiceRoll,
    EndPhaseAction, FortifyAction,
    FortifyTurnState,
    GameState, OccupyAction, OccupyTurnState, Player, TurnInCardsAction, TurnState, GameEvent, TerritoryStateMap
} from "@/game/types";
import {CardName, Schema, TerritoryName} from "@/game/schema";
import {nextDeployment} from "@/game/deployment";
import {META} from "@/game/meta";
import {draftSummary} from "@/game/draft";
import {deployment, territoryOccupied} from "@/game/factory";
import {findShortestRoute} from "@/game/route";
import {PureGameRng, GameRng, RngState} from "@/game/rng";


export class ServerGame {
    static new(
        id: number,
        players: Omit<Player, 'cards'>[],
        rng: GameRng,
        date: Date = new Date()
    ): ServerGame {
        const territories = rng.draft(players.length)
        const cards = rng.shuffleCards()

        const deployment = nextDeployment(1, territories)
        const turn: TurnState = {
            phase: 'deploy',
            playerOrdinal: 1,
            armiesRemaining: deployment.total,
            selected: null,
        }
        const events: GameEvent[] = [
            ...draftSummary(territories)
                .sort((a, b) => a.playerOrdinal - b.playerOrdinal)
                .map(draft => ({
                    type: 'draft' as const,
                    date,
                    ...draft
                })),
            { ...deployment, type: 'deployment', date, playerOrdinal: 1 }
        ]

        return new ServerGame(
            id,
            players.map(p => ({ ...p, cards: [] })),
            rng,
            territories,
            cards,
            turn,
            1,
            events
        )
    }

    static fromState(state: GameState, rng: GameRng = PureGameRng.fromState(state.rngState)): ServerGame {
        return new ServerGame(
            state.id,
            state.players,
            rng,
            state.territories,
            state.cards,
            state.turn,
            state.turnNumber,
            state.events
        )
    }

    private constructor(
        private readonly id: number,
        private readonly players: Player[],
        private readonly rng: GameRng,
        private readonly territories: TerritoryStateMap,
        private readonly cards: CardName[],
        private turn: TurnState,
        private turnNumber: number,
        private readonly events: GameEvent[],
    ) {}

    update(...actions: Action[]): this {
        for (let action of actions) {
            this.events.push(action)

            if (this.turn.playerOrdinal !== action.playerOrdinal) {
                error(action, `it is not player ${action.playerOrdinal}'s turn`)
            } else {
                switch (action.type) {
                    case 'end_phase':
                        this.endPhaseAction(action)
                        break
                    case "deploy":
                        this.deployAction(action)
                        break
                    case "attack":
                        this.attackAction(action)
                        break
                    case "occupy":
                        this.occupyAction(action)
                        break;
                    case "fortify":
                        this.fortifyAction(action)
                        break;
                    case 'turn_in_cards':
                        this.turnInCardsAction(action)
                        break;
                    default:
                        error(action, 'unsupported action')
                }
            }
        }

        return this
    }

    toState(): GameState {
        return {
            id: this.id,
            rngState: this.rng.state(),
            cards: this.cards,
            players: this.players,
            events: this.events,
            territories: this.territories,
            turn: this.turn,
            turnNumber: this.turnNumber
        }
    }

    private endPhaseAction(action: EndPhaseAction): void {
        switch (this.turn.phase) {
            case "deploy":
                this.turn = {
                    phase: 'attack',
                    playerOrdinal: this.turn.playerOrdinal,
                    territoryCaptured: false
                } as AttackTurnState
                break;
            case "attack":
                this.endAttackPhase(action)
                break
            case "fortify":
                this.nextTurn(action)
                break;
            default:
                error(action, `invalid sequence of actions, cannot end the ${this.turn.phase} phase`)
        }
    }

    private nextTurn(action: Action): void {
        if (this.turn.phase !== 'fortify') {
            error(action, 'not in the fortify phase')
        }

        const nextPlayerOrdinal = this.turn.playerOrdinal === this.players.length ? 1 : this.turn.playerOrdinal + 1
        const playerDeployment = nextDeployment(nextPlayerOrdinal, this.territories)
        this.events.push(
            deployment(nextPlayerOrdinal, playerDeployment)
        )
        this.turn = {
            phase: 'deploy',
            playerOrdinal: nextPlayerOrdinal,
            selected: null,
            armiesRemaining: playerDeployment.total
        } as DeployTurnState
        this.turnNumber += 1
    }


    private deployAction(action: DeployAction): void {
        if (this.turn.phase !== 'deploy') {
            error(action, 'not in the deploy phase')
        }

        if (action.armies < 1) {
            error(action, 'must deploy at least one army')
        }

        if (action.armies > this.turn.armiesRemaining) {
            error(action, `cannot deploy ${action.armies} armies as only have ${this.turn.armiesRemaining} remaining`)
        }

        const territory = this.territories[action.territory]
        if (territory.owner !== action.playerOrdinal) {
            error(action, `${action.territory} is not occupied`)
        }
        territory.armies += action.armies
        this.turn.armiesRemaining -= action.armies
    }

    private attackAction(action: AttackAction): void {
        if (this.turn.phase !== 'attack') {
            error(action, 'not in the attack phase')
        }

        const territoryFrom = this.territories[action.territoryFrom]
        if (territoryFrom.owner !== action.playerOrdinal) {
            error(action, `cannot attack from ${action.territoryFrom} as it is not occupied`)
        }

        if ((territoryFrom.armies - action.attackingDice) < 1) {
            error(action, `cannot attack with ${action.attackingDice} armies from ${action.territoryFrom} as only ${territoryFrom.armies} armies are deployed`)
        }

        const territoryTo = this.territories[action.territoryTo]
        if (territoryTo.owner === action.playerOrdinal) {
            error(action, `cannot attack ${action.territoryTo} as it is already occupied`)
        }

        if (action.defendingDice > territoryTo.armies) {
            error(action, `cannot defend ${action.territoryTo} with ${action.defendingDice} armies as only ${territoryTo.armies} armies are deployed`)
        }

        if (!META[action.territoryFrom].borders.map(b => typeof b === 'string' ? b : b.name).includes(action.territoryTo)) {
            error(action, `cannot attack from ${action.territoryFrom} to ${action.territoryTo} as they do not share a border`)
        }

        const attackingDice = this.rng.diceRoll(action.attackingDice)
        const defendingDice = this.rng.diceRoll(action.defendingDice)

        const { attackerLosses, defenderLosses } = this.diceBattle(attackingDice, defendingDice)
        territoryTo.armies -= defenderLosses
        territoryFrom.armies -= attackerLosses

        if (territoryTo.armies > 0) {
            // continue attacking
            return
        }

        // territory captured
        territoryTo.owner = territoryFrom.owner
        const minArmies = action.attackingDice - attackerLosses
        const maxArmies = territoryFrom.armies - 1

        if (maxArmies === minArmies) {
            this.turn.territoryCaptured = true
            territoryFrom.armies -= maxArmies
            territoryTo.armies += maxArmies
        } else {
            this.turn = {
                phase: 'occupy',
                playerOrdinal: this.turn.playerOrdinal,
                territoryFrom: action.territoryFrom,
                territoryTo: action.territoryTo,
                minArmies,
                maxArmies,
                selectedArmies: maxArmies,
            } as OccupyTurnState
        }

        this.events.push(
            territoryOccupied(action.playerOrdinal, action.territoryTo)
        )
    }

    private diceBattle(attackingRolls: DiceRoll[], defendingRolls: DiceRoll[]) {
        attackingRolls.sort((a, b) => b - a)
        defendingRolls.sort((a, b) => b - a)
        let attackerLosses = 0
        let defenderLosses = 0

        const comparisons = Math.min(attackingRolls.length, defendingRolls.length)
        for (let i = 0; i < comparisons; i++) {
            if (attackingRolls[i] > defendingRolls[i]) {
                defenderLosses++
            } else {
                attackerLosses++
            }
        }

        return { attackerLosses, defenderLosses }
    }

    private occupyAction(action: OccupyAction): void {
        if (this.turn.phase !== 'occupy') {
            error(action, 'not in the occupy phase')
        }

        if (action.armies < this.turn.minArmies) {
            error(action, `must move at least ${this.turn.minArmies} armies`)
        }

        if (action.armies > this.turn.maxArmies) {
            error(action, `cannot move more than ${this.turn.maxArmies} armies`)
        }

        // no need to validate occupation here as we did so in the attack phase
        this.territories[this.turn.territoryFrom].armies -= action.armies
        this.territories[this.turn.territoryTo].armies += action.armies

        this.turn = {
            phase: 'attack',
            playerOrdinal: this.turn.playerOrdinal,
            territoryCaptured: true
        } as AttackTurnState
    }

    private fortifyAction(action: FortifyAction): void {
        if (this.turn.phase !== 'fortify') {
            error(action, 'not in the fortify phase')
        }

        if (action.territoryFrom === action.territoryTo) {
            error(action, `cannot move armies back to the same territory`)
        }

        const territoryFrom = this.territories[action.territoryFrom]
        if (territoryFrom.owner !== action.playerOrdinal) {
            error(action, `cannot move armies from ${action.territoryFrom} as it is not occupied`)
        }

        const territoryTo = this.territories[action.territoryTo]
        if (territoryTo.owner !== action.playerOrdinal) {
            error(action, `cannot move armies to ${action.territoryTo} as it is not occupied`)
        }

        if ((territoryFrom.armies - action.armies) < 1) {
            error(action, `cannot move ${action.armies} armies from ${action.territoryFrom} as only ${territoryFrom.armies} armies are deployed`)
        }

        const route = findShortestRoute(this.territories, action.territoryFrom, action.territoryTo)
        if (!route) {
            error(action, `cannot move armies from ${action.territoryFrom} to ${action.territoryTo} as there is no available route`)
        }

        territoryFrom.armies -= action.armies
        territoryTo.armies += action.armies

        this.nextTurn(action)
    }

    private turnInCardsAction(action: TurnInCardsAction): void {
        if (this.turn.phase !== 'deploy') {
            error(action, 'not in the deploy phase')
        }

        const player = this.players.find(p => p.ordinal === action.playerOrdinal)
        if (!player) {
            error(action, `no such player ${action.playerOrdinal}`)
        }

        for (let card of action.cards) {
            if (!player.cards.includes(card)) {
                error(action, `does not hold the ${card} card`)
            }
        }

        if (action.cards.length !== 3) {
            error(action, `must turn in exactly three cards`)
        }

        let wild = 0
        let infantry = 0
        let cavalry = 0
        let artillery = 0
        const territories: TerritoryName[] = []
        for (let card of action.cards) {
            if (card === 'wild1' || card === 'wild2') {
                wild++
                continue
            }
            territories.push(card)
            switch (META[card].card) {
                case 'infantry':
                    infantry++
                    break
                case 'cavalry':
                    cavalry++
                    break
                case 'artillery':
                    artillery++
                    break
            }
        }

        let armies = 0
        if (wild + (infantry > 0 ? 1 : 0) + (cavalry > 0 ? 1 : 0) + (artillery > 0 ? 1 : 0) === 3) {
            // one of each = 10
            armies = 10
        } else if (wild + artillery === 3) {
            // 3x artillery = 8
            armies = 8
        } else if (wild + cavalry === 3) {
            // 3x cavalry = 6
            armies = 6
        } else if (wild + infantry === 3) {
            // 3x infantry = 4
            armies = 4
        } else {
            error(action, `must turn in three of the same or one of each card`)
        }
        this.turn.armiesRemaining += armies

        const territoryBonus = territories.find(t => this.territories[t].owner === action.playerOrdinal)
        if (territoryBonus) {
            this.territories[territoryBonus].armies += 2
        }
    }

    private endAttackPhase(action: EndPhaseAction): void {
        if (this.turn.phase !== 'attack') {
            error(action, 'not in the attack phase')
        }

        if (this.turn.territoryCaptured) {
            this.drawCard()
        }

        this.turn = {
            phase: 'fortify',
            playerOrdinal: this.turn.playerOrdinal
        } as FortifyTurnState
    }

    private drawCard() {
        const player = this.players.find(p => p.ordinal === this.turn.playerOrdinal)
        if (!player) {
            throw new Error('no player with ordinal ' + this.turn.playerOrdinal)
        }

        // TODO deal with an empty deck
        const card: CardName = this.cards.pop()!
        player.cards.push(card)
    }
}

export class GameStateError extends Error {
    constructor(readonly action: Action, message: string) {
        super(`could not apply ${action.type} for player ${action.playerOrdinal}, ${message}`);
    }
}

function error(action: Action, message: string): never {
    throw new GameStateError(action, message)
}


