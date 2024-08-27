export type TerritoryName =
    'afghanistan'
    | 'alaska'
    | 'alberta'
    | 'argentina'
    | 'brazil'
    | 'central_america'
    | 'china'
    | 'congo'
    | 'east_africa'
    | 'eastern_australia'
    | 'eastern_united_states'
    | 'egypt'
    | 'great_britain'
    | 'greenland'
    | 'iceland'
    | 'india'
    | 'indonesia'
    | 'irkutsk'
    | 'japan'
    | 'kamchatka'
    | 'madagascar'
    | 'middle_east'
    | 'mongolia'
    | 'new_guinea'
    | 'north_africa'
    | 'northern_europe'
    | 'northwest_territory'
    | 'ontario'
    | 'peru'
    | 'quebec'
    | 'scandinavia'
    | 'siam'
    | 'siberia'
    | 'south_africa'
    | 'southern_europe'
    | 'ukraine'
    | 'ural'
    | 'venezuela'
    | 'western_australia'
    | 'western_europe'
    | 'western_united_states'
    | 'yakursk'

export interface Player {
    id: number
    username: string
    displayName: string
}

export type TurnPhase = 'deploy' | 'attack' | 'fortify'

export interface TurnStateBase {
    playerId: number
    phase: TurnPhase
}

export interface DeployTurnState extends TurnStateBase {
    phase: 'deploy'
    selected: TerritoryName | null
}

export interface AttackTurnState extends TurnStateBase {
    phase: 'attack'
}

export interface FortifyTurnState extends TurnStateBase {
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

export interface GameState {
    id: number
    version: number
    turnNumber: number
    dateStarted: Date
    dateUpdated: Date
    players: Player[]
    turn: TurnState
    territories: Record<TerritoryName, TerritoryState>
}

export interface GameSummary extends Pick<GameState, 'id' | 'dateStarted' | 'dateUpdated' | 'turnNumber'> {
    opponent: Player
}
