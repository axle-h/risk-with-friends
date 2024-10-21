import {ActionType, CardName, TerritoryName} from "@/game/schema";
import {AvailableDeployment} from "@/game/deployment";
import {DraftSummary} from "@/game/draft";
import {GameRng} from "@/game/rng";
import {Route} from "@/game/route";

export interface Player {
    ordinal: number
    username: string
    displayName: string
    cards: CardName[]
}

export type NewPlayer = Omit<Player, 'cards'>

export type TurnPhase = 'deploy' | 'attack' | 'occupy' | 'fortify'

export type CardType = 'infantry' | 'cavalry' | 'artillery'

export interface ActionBase<Type = ActionType> {
    type: Type
    date: Date
    playerOrdinal: number
}

export interface DeployAction extends ActionBase {
    type: 'deploy'
    territory: TerritoryName
    armies: number
}

export type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6

export interface AttackAction extends ActionBase {
    type: 'attack'
    territoryFrom: TerritoryName
    territoryTo: TerritoryName
    attackingDice: number
}

export interface OccupyAction extends ActionBase {
    type: 'occupy'
    armies: number
}

export interface FortifyAction extends ActionBase {
    type: 'fortify'
    territoryFrom: TerritoryName
    territoryTo: TerritoryName
    armies: number
}

export interface EndPhaseAction extends ActionBase {
    type: 'end_phase'
}

export interface TurnInCardsAction extends ActionBase {
    type: 'turn_in_cards'
    cards: [CardName, CardName, CardName]
}

export type Action = DeployAction | AttackAction | OccupyAction | FortifyAction | EndPhaseAction | TurnInCardsAction


// Events are like actions but ephemeral i.e. derived from actions
export type EventType = ActionType | 'draft' | 'deployment' | 'territory_occupied'
type EventBase = ActionBase<EventType>

interface DraftEvent extends EventBase, Omit<DraftSummary, 'playerOrdinal'> {
    type: 'draft'
}

interface DeploymentEvent extends EventBase, AvailableDeployment {
    type: 'deployment'
}

interface TerritoryOccupiedEvent extends EventBase {
    type: 'territory_occupied'
    territory: TerritoryName
}

export type GameEvent = Action | DraftEvent | DeploymentEvent | TerritoryOccupiedEvent

export interface TurnStateBase {
    playerOrdinal: number
    phase: TurnPhase
}

export interface DeployTurnState extends TurnStateBase {
    phase: 'deploy'
    armiesRemaining: number
    selected?: {
        territory: TerritoryName
        armies: number
    }
}

export interface AttackTurnState extends TurnStateBase {
    phase: 'attack'
    territoryCaptured: boolean
    selected?: {
        territoryFrom: TerritoryName
        adjacentUnoccupiedTerritories: TerritoryName[]
        availableAttacking: number
        territoryTo: TerritoryName | null
    }
}

export interface OccupyTurnState extends TurnStateBase {
    phase: 'occupy'
    territoryFrom: TerritoryName
    territoryTo: TerritoryName
    minArmies: number
    maxArmies: number
    selectedArmies: number
}

export interface FortifyTurnState extends TurnStateBase {
    phase: 'fortify'
    selected?: {
        territoryFrom: TerritoryName
        availableArmies: number
        armies: number | null
        route: Route | null
    }
}

export type TurnState = DeployTurnState | AttackTurnState | OccupyTurnState | FortifyTurnState

export interface TerritoryState {
    owner: number | null
    armies: number
}

export type TerritoryStateMap = Record<TerritoryName, TerritoryState>

export interface GameState {
    id: number
    rngState: readonly number[]
    version: number
    cards: CardName[]
    turnNumber: number
    players: Player[]
    turn: TurnState
    territories: TerritoryStateMap
    events: GameEvent[]
    dateStarted: Date
    dateUpdated: Date
}

export type GameStatus = 'your_turn' | 'opponents_turn' | 'victory' | 'defeated'

export interface GameSummary {
    id: number
    opponents: Player[]
    status: GameStatus
    dateStarted: Date
    dateUpdated: Date
}
