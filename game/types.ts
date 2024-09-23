import {ActionType, CardName, TerritoryName} from "@/game/schema";
import {AvailableDeployment} from "@/game/deployment";
import {DraftSummary} from "@/game/draft";

export interface Player {
    ordinal: number
    username: string
    displayName: string
    cards: CardName[]
}

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
    attackingDiceRoll: DiceRoll[]
    defendingDiceRoll: DiceRoll[]
}

export interface OccupyAction extends ActionBase {
    type: 'occupy'
    territoryFrom: TerritoryName
    territoryTo: TerritoryName
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
    phase: TurnPhase
}

export interface DrawCardAction extends ActionBase {
    type: 'draw_card'
    card: CardName
}

export interface TurnInCardsAction extends ActionBase {
    type: 'turn_in_cards'
    cards: [CardName, CardName, CardName]
}

export type Action = DeployAction | AttackAction | OccupyAction | FortifyAction | EndPhaseAction | DrawCardAction | TurnInCardsAction


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

export type Event = Action | DraftEvent | DeploymentEvent | TerritoryOccupiedEvent

export interface TurnStateBase {
    playerOrdinal: number
    phase: TurnPhase
}

export interface DeployTurnState extends TurnStateBase {
    phase: 'deploy'
    armiesRemaining: number
    selected: {
        territory: TerritoryName
        armies: number
    } | null
}

export interface AttackTurnState extends TurnStateBase {
    phase: 'attack'
    territoryCaptured: boolean
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
}

export type TurnState = DeployTurnState | AttackTurnState | OccupyTurnState | FortifyTurnState

export interface TerritoryState {
    owner: number | null
    armies: number
}

export type TerritoryStateMap = Record<TerritoryName, TerritoryState>

export interface GameState {
    id: number
    turnNumber: number
    players: Player[]
    turn: TurnState
    territories: TerritoryStateMap
    events: Event[]
}

export interface GameSummary extends Pick<GameState, 'id' | 'turnNumber'> {
    opponent: Player
    dateStarted: Date
    dateUpdated: Date
}
