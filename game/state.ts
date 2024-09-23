import {
    Action, AttackAction,
    AttackTurnState,
    DeployAction,
    DeployTurnState, DiceRoll, DrawCardAction,
    EndPhaseAction, FortifyAction,
    FortifyTurnState,
    GameState, OccupyAction, OccupyTurnState, Player, TerritoryStateMap, TurnInCardsAction
} from "@/game/types";
import {CardName, TerritoryName} from "@/game/schema";
import {nextDeployment} from "@/game/deployment";
import {META} from "@/game/meta";
import {draftSummary} from "@/game/draft";
import {territoryOccupied} from "@/game/factory";

export function newGameState(
    id: number,
    players: Player[],
    territories: TerritoryStateMap, // must be drafted already
    actions: Action[] = [],
    date: Date = new Date(),
): GameState {
    const deployment = nextDeployment(1, territories)
    const state: GameState = {
        id,
        players,
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
    let stateOrError: GameState | string | null = null

    if (state.turn.playerOrdinal !== action.playerOrdinal) {
        stateOrError = `not player ${action.playerOrdinal}'s turn`
    } else {
        switch (action.type) {
            case 'end_phase':
                stateOrError = endPhaseAction(state, action)
                break
            case "deploy":
                stateOrError = deployAction(state, action)
                break
            case "attack":
                stateOrError = attackAction(state, action)
                break
            case "occupy":
                stateOrError = occupyAction(state, action)
                break;
            case "fortify":
                stateOrError = fortifyAction(state, action)
                break;
            case 'draw_card':
                stateOrError = drawCardAction(state, action)
                break;
            case 'turn_in_cards':
                stateOrError = turnInCardsAction(state, action)
                break;
            default:
                state.events.pop()
                throw new Error('unsupported action')
        }
    }

    if (typeof stateOrError === 'string') {
        state.events.pop()
        throw new Error(`could not apply ${action.type} for player ${action.playerOrdinal}: ${stateOrError}`)
    }

    return stateOrError
}

function endAttackPhase(state: GameState, drawCard: CardName | null): GameState | string {
    if (state.turn.phase !== 'attack') {
        return 'not in the attack phase'
    }

    if (state.turn.territoryCaptured && !drawCard) {
        return 'expected to draw a card but none drawn'
    }

    if (!state.turn.territoryCaptured && !!drawCard) {
        return 'cannot draw a card'
    }

    if (drawCard) {
        const player = state.players.find(p => p.ordinal === state.turn.playerOrdinal)
        if (!player) {
            return `no such player ${state.turn.playerOrdinal}`
        }
        player.cards.push(drawCard)
    }

    state.turn = {
        phase: 'fortify',
        playerOrdinal: state.turn.playerOrdinal
    } as FortifyTurnState
    return state
}

function endPhaseAction(state: GameState, action: EndPhaseAction): GameState | string {
    if (state.turn.phase !== action.phase) {
        return `not in the ${action.phase} phase`
    }
    switch (state.turn.phase) {
        case "deploy":
            state.turn = {
                phase: 'attack',
                playerOrdinal: state.turn.playerOrdinal,
                territoryCaptured: false
            } as AttackTurnState
            break;
        case "attack":
            return endAttackPhase(state, null)
        case 'occupy':
            state.turn = {
                phase: 'attack',
                playerOrdinal: state.turn.playerOrdinal,
                territoryCaptured: true
            } as AttackTurnState
            break
        case "fortify":
            const nextPlayerOrdinal = state.turn.playerOrdinal === state.players.length ? 1 : state.turn.playerOrdinal + 1
            const deployment = nextDeployment(nextPlayerOrdinal, state.territories)
            state.events.push(
                { ...deployment, type: 'deployment', date: action.date, playerOrdinal: action.playerOrdinal }
            )
            state.turn = {
                phase: 'deploy',
                playerOrdinal: nextPlayerOrdinal,
                selected: null,
                armiesRemaining: deployment.total
            } as DeployTurnState
            state.turnNumber += 1
            break;
    }

    return state
}


function deployAction(state: GameState, action: DeployAction): GameState | string {
    if (state.turn.phase !== 'deploy') {
        return 'not in the deploy phase'
    }

    if (action.armies < 1) {
        return 'must deploy at least one army'
    }

    if (action.armies > state.turn.armiesRemaining) {
        return `cannot deploy ${action.armies} armies as only have ${state.turn.armiesRemaining} remaining`
    }

    const territory = state.territories[action.territory]
    if (territory.owner !== action.playerOrdinal) {
        return `${action.territory} is not occupied`
    }
    territory.armies += action.armies
    state.turn.armiesRemaining -= action.armies
    return state
}

function attackAction(state: GameState, action: AttackAction): GameState | string {
    if (state.turn.phase !== 'attack') {
        return 'not in the attack phase'
    }

    const territoryFrom = state.territories[action.territoryFrom]
    if (territoryFrom.owner !== action.playerOrdinal) {
        return `cannot attack from ${action.territoryFrom} as it is not occupied`
    }

    if ((territoryFrom.armies - action.attackingDiceRoll.length) < 1) {
        return `cannot attack with ${action.attackingDiceRoll.length} armies from ${action.territoryFrom} as only ${territoryFrom.armies} armies are deployed`
    }

    const territoryTo = state.territories[action.territoryTo]
    if (territoryTo.owner === action.playerOrdinal) {
        return `cannot attack ${action.territoryTo} as it is already occupied`
    }

    if (action.defendingDiceRoll.length > territoryTo.armies) {
        return `cannot defend ${action.territoryTo} with ${action.defendingDiceRoll.length} armies as only ${territoryTo.armies} armies are deployed`
    }

    if (!META[action.territoryFrom].borders.map(b => typeof b === 'string' ? b : b.name).includes(action.territoryTo)) {
        return `cannot attack from ${action.territoryFrom} to ${action.territoryTo} as they do not share a border`
    }

    const { attackerLosses, defenderLosses } = diceBattle(action.attackingDiceRoll, action.defendingDiceRoll)
    territoryTo.armies -= defenderLosses
    territoryFrom.armies -= attackerLosses

    if (territoryTo.armies > 0) {
        // continue attacking
        return state
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

    return state
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

function occupyAction(state: GameState, action: OccupyAction): GameState | string {
    if (state.turn.phase !== 'occupy') {
        return 'not in the occupy phase'
    }
    return moveArmies(state, action)
}

function fortifyAction(state: GameState, action: FortifyAction): GameState | string {
    if (state.turn.phase !== 'fortify') {
        return 'not in the fortify phase'
    }
    return moveArmies(state, action)
}

function moveArmies(state: GameState, action: OccupyAction | FortifyAction): GameState | string {
    const territoryFrom = state.territories[action.territoryFrom]
    if (territoryFrom.owner !== action.playerOrdinal) {
        return `cannot move armies from ${action.territoryFrom} as it is not occupied`
    }

    const territoryTo = state.territories[action.territoryTo]
    if (territoryTo.owner !== action.playerOrdinal) {
        return `cannot move armies to ${action.territoryTo} as it is not occupied`
    }

    if ((territoryFrom.armies - action.armies) < 1) {
        return `cannot move ${action.armies} armies from ${action.territoryFrom} as only ${territoryFrom.armies} armies are deployed`
    }

    territoryFrom.armies -= action.armies
    territoryTo.armies += action.armies
    return state
}

function drawCardAction(state: GameState, action: DrawCardAction): GameState | string {
    return endAttackPhase(state, action.card)
}

function turnInCardsAction(state: GameState, action: TurnInCardsAction): GameState | string {
    if (state.turn.phase !== 'deploy') {
        return 'not in the deploy phase'
    }

    const player = state.players.find(p => p.ordinal === action.playerOrdinal)
    if (!player) {
        return `no such player ${action.playerOrdinal}`
    }

    if (action.cards.length !== 3) {
        return `must turn in exactly three cards`
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
        return `must turn in three of the same or one of each card`
    }
    state.turn.armiesRemaining += armies

    const territoryBonus = territories.find(t => state.territories[t].owner === action.playerOrdinal)
    if (territoryBonus) {
        state.territories[territoryBonus].armies += 2
    }

    return state
}