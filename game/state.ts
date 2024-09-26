import {
    Action, AttackAction,
    AttackTurnState,
    DeployAction,
    DeployTurnState, DiceRoll,
    EndPhaseAction, FortifyAction,
    FortifyTurnState,
    GameState, OccupyAction, OccupyTurnState, Player, TerritoryStateMap, TurnInCardsAction
} from "@/game/types";
import {CardName, Schema, TerritoryName} from "@/game/schema";
import {nextDeployment} from "@/game/deployment";
import {META} from "@/game/meta";
import {draft, draftSummary} from "@/game/draft";
import {deployment, territoryOccupied} from "@/game/factory";
import {findShortestRoute} from "@/game/route";
import {PureRandRng} from "@/game/rng";

export function newGameState(
    id: number,
    seed: number,
    players: Player[],
    actions: Action[] = [],
    date: Date = new Date(),
): GameState {
    const rng = new PureRandRng(seed)
    const territories = draft(rng, players.length)
    const cards = [...Schema.CardName.options]
    rng.shuffle(cards)

    const deployment = nextDeployment(1, territories)
    const state: GameState = {
        id,
        players,
        cards,
        turnNumber: 1,
        turn: {
            phase: 'deploy',
            playerOrdinal: 1,
            armiesRemaining: deployment.total,
            selected: null,
        },
        territories,
        events: [
            ...draftSummary(territories)
                .sort((a, b) => a.playerOrdinal - b.playerOrdinal)
                .map(draft => ({
                    type: 'draft' as const,
                    date,
                    ...draft
                })),
            { ...deployment, type: 'deployment', date, playerOrdinal: 1 }
        ]
    }
    return actions.reduce(updateState, state)
}

export function updateState(state: GameState, action: Action): GameState {
    state.events.push(action)

    if (state.turn.playerOrdinal !== action.playerOrdinal) {
        error(action, `it is not player ${action.playerOrdinal}'s turn`)
    } else {
        switch (action.type) {
            case 'end_phase':
                endPhaseAction(state, action)
                break
            case "deploy":
                deployAction(state, action)
                break
            case "attack":
                attackAction(state, action)
                break
            case "occupy":
                occupyAction(state, action)
                break;
            case "fortify":
                fortifyAction(state, action)
                break;
            case 'turn_in_cards':
                turnInCardsAction(state, action)
                break;
            default:
                error(action, 'unsupported action')
        }
    }

    return state
}

export class GameStateError extends Error {
    constructor(readonly action: Action, message: string) {
        super(`could not apply ${action.type} for player ${action.playerOrdinal}, ${message}`);
    }
}

export function drawCard(state: GameState) {
    const player = state.players.find(p => p.ordinal === state.turn.playerOrdinal)
    if (!player) {
        throw new Error('no player with ordinal ' + state.turn.playerOrdinal)
    }

    // TODO deal with an empty deck
    const card: CardName = state.cards.pop()!
    player.cards.push(card)
}

function error(action: Action, message: string): never {
    throw new GameStateError(action, message)
}

function endAttackPhase(state: GameState, action: EndPhaseAction): void {
    if (state.turn.phase !== 'attack') {
        error(action, 'not in the attack phase')
    }

    if (state.turn.territoryCaptured) {
        drawCard(state)
    }

    state.turn = {
        phase: 'fortify',
        playerOrdinal: state.turn.playerOrdinal
    } as FortifyTurnState
}

function endPhaseAction(state: GameState, action: EndPhaseAction): void {
    switch (state.turn.phase) {
        case "deploy":
            state.turn = {
                phase: 'attack',
                playerOrdinal: state.turn.playerOrdinal,
                territoryCaptured: false
            } as AttackTurnState
            break;
        case "attack":
            endAttackPhase(state, action)
            break
        case "fortify":
            nextTurn(state, action)
            break;
        default:
            error(action, `invalid sequence of actions, cannot end the ${state.turn.phase} phase`)
    }
}

function nextTurn(state: GameState, action: Action): void {
    if (state.turn.phase !== 'fortify') {
        error(action, 'not in the fortify phase')
    }

    const nextPlayerOrdinal = state.turn.playerOrdinal === state.players.length ? 1 : state.turn.playerOrdinal + 1
    const playerDeployment = nextDeployment(nextPlayerOrdinal, state.territories)
    state.events.push(
        deployment(nextPlayerOrdinal, playerDeployment)
    )
    state.turn = {
        phase: 'deploy',
        playerOrdinal: nextPlayerOrdinal,
        selected: null,
        armiesRemaining: playerDeployment.total
    } as DeployTurnState
    state.turnNumber += 1
}


function deployAction(state: GameState, action: DeployAction): void {
    if (state.turn.phase !== 'deploy') {
        error(action, 'not in the deploy phase')
    }

    if (action.armies < 1) {
        error(action, 'must deploy at least one army')
    }

    if (action.armies > state.turn.armiesRemaining) {
        error(action, `cannot deploy ${action.armies} armies as only have ${state.turn.armiesRemaining} remaining`)
    }

    const territory = state.territories[action.territory]
    if (territory.owner !== action.playerOrdinal) {
        error(action, `${action.territory} is not occupied`)
    }
    territory.armies += action.armies
    state.turn.armiesRemaining -= action.armies
}

function attackAction(state: GameState, action: AttackAction): void {
    if (state.turn.phase !== 'attack') {
        error(action, 'not in the attack phase')
    }

    const territoryFrom = state.territories[action.territoryFrom]
    if (territoryFrom.owner !== action.playerOrdinal) {
        error(action, `cannot attack from ${action.territoryFrom} as it is not occupied`)
    }

    if ((territoryFrom.armies - action.attackingDiceRoll.length) < 1) {
        error(action, `cannot attack with ${action.attackingDiceRoll.length} armies from ${action.territoryFrom} as only ${territoryFrom.armies} armies are deployed`)
    }

    const territoryTo = state.territories[action.territoryTo]
    if (territoryTo.owner === action.playerOrdinal) {
        error(action, `cannot attack ${action.territoryTo} as it is already occupied`)
    }

    if (action.defendingDiceRoll.length > territoryTo.armies) {
        error(action, `cannot defend ${action.territoryTo} with ${action.defendingDiceRoll.length} armies as only ${territoryTo.armies} armies are deployed`)
    }

    if (!META[action.territoryFrom].borders.map(b => typeof b === 'string' ? b : b.name).includes(action.territoryTo)) {
        error(action, `cannot attack from ${action.territoryFrom} to ${action.territoryTo} as they do not share a border`)
    }

    const { attackerLosses, defenderLosses } = diceBattle(action.attackingDiceRoll, action.defendingDiceRoll)
    territoryTo.armies -= defenderLosses
    territoryFrom.armies -= attackerLosses

    if (territoryTo.armies > 0) {
        // continue attacking
        return
    }

    // territory captured
    territoryTo.owner = territoryFrom.owner
    const minArmies = action.attackingDiceRoll.length - attackerLosses
    const maxArmies = territoryFrom.armies - 1

    if (maxArmies === minArmies) {
        state.turn.territoryCaptured = true
        territoryFrom.armies -= maxArmies
        territoryTo.armies += maxArmies
    } else {
        state.turn = {
            phase: 'occupy',
            playerOrdinal: state.turn.playerOrdinal,
            territoryFrom: action.territoryFrom,
            territoryTo: action.territoryTo,
            minArmies,
            maxArmies,
            selectedArmies: maxArmies,
        } as OccupyTurnState
    }

    state.events.push(
        territoryOccupied(action.playerOrdinal, action.territoryTo)
    )
}

function diceBattle(attackingRolls: DiceRoll[], defendingRolls: DiceRoll[]) {
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

function occupyAction(state: GameState, action: OccupyAction): void {
    if (state.turn.phase !== 'occupy') {
        error(action, 'not in the occupy phase')
    }

    if (action.armies < state.turn.minArmies) {
        error(action, `must move at least ${state.turn.minArmies} armies`)
    }

    if (action.armies > state.turn.maxArmies) {
        error(action, `cannot move more than ${state.turn.maxArmies} armies`)
    }

    // no need to validate occupation here as we did so in the attack phase
    state.territories[state.turn.territoryFrom].armies -= action.armies
    state.territories[state.turn.territoryTo].armies += action.armies

    state.turn = {
        phase: 'attack',
        playerOrdinal: state.turn.playerOrdinal,
        territoryCaptured: true
    } as AttackTurnState
}

function fortifyAction(state: GameState, action: FortifyAction): void {
    if (state.turn.phase !== 'fortify') {
        error(action, 'not in the fortify phase')
    }

    if (action.territoryFrom === action.territoryTo) {
        error(action, `cannot move armies back to the same territory`)
    }

    const territoryFrom = state.territories[action.territoryFrom]
    if (territoryFrom.owner !== action.playerOrdinal) {
        error(action, `cannot move armies from ${action.territoryFrom} as it is not occupied`)
    }

    const territoryTo = state.territories[action.territoryTo]
    if (territoryTo.owner !== action.playerOrdinal) {
        error(action, `cannot move armies to ${action.territoryTo} as it is not occupied`)
    }

    if ((territoryFrom.armies - action.armies) < 1) {
        error(action, `cannot move ${action.armies} armies from ${action.territoryFrom} as only ${territoryFrom.armies} armies are deployed`)
    }

    const route = findShortestRoute(state.territories, action.territoryFrom, action.territoryTo)
    if (!route) {
        error(action, `cannot move armies from ${action.territoryFrom} to ${action.territoryTo} as there is no available route`)
    }

    territoryFrom.armies -= action.armies
    territoryTo.armies += action.armies

    nextTurn(state, action)
}

function turnInCardsAction(state: GameState, action: TurnInCardsAction): void {
    if (state.turn.phase !== 'deploy') {
        error(action, 'not in the deploy phase')
    }

    const player = state.players.find(p => p.ordinal === action.playerOrdinal)
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
    state.turn.armiesRemaining += armies

    const territoryBonus = territories.find(t => state.territories[t].owner === action.playerOrdinal)
    if (territoryBonus) {
        state.territories[territoryBonus].armies += 2
    }
}