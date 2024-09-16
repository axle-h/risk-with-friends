import {ContinentName, DeployAction, TerritoryName} from "@/game/schema";

export interface Player {
    id: number
    username: string
    displayName: string
}

export type TurnPhase = 'deploy' | 'attack' | 'fortify'

export interface TurnPhaseBase {
    playerId: number
    phase: TurnPhase
}

export type AvailableDeployment = Record<ContinentName, number> & { territoryBonus: number, total: number }

export interface DeployTurnState extends TurnPhaseBase {
    phase: 'deploy'
    armiesRemaining: number
    selected: Pick<DeployAction, 'territory' | 'armies'> | null
}

export interface AttackTurnState extends TurnPhaseBase {
    phase: 'attack'
}

export interface FortifyTurnState extends TurnPhaseBase {
    phase: 'fortify'
}

export type TurnState = DeployTurnState | AttackTurnState | FortifyTurnState

export interface EmptyTerritoryState {
    owner: null
}

export interface OccupiedTerritoryState {
    owner: number
    armies: number
}

export type TerritoryState = EmptyTerritoryState | OccupiedTerritoryState

export type TerritoryStateMap = Record<TerritoryName, TerritoryState>

export interface GameState {
    id: number
    version: number
    turnNumber: number
    dateStarted: Date
    dateUpdated: Date
    players: Player[]
    turn: TurnState
    territories: TerritoryStateMap
}

export interface GameSummary extends Pick<GameState, 'id' | 'dateStarted' | 'dateUpdated' | 'turnNumber'> {
    opponent: Player
}
