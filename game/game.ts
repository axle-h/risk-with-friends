import {
    ContinentName, AvailableDeployment,
    GameState,
    OccupiedTerritoryState,
    Player,
    TerritoryName,
    TerritoryState, TerritoryStateMap,
    TurnState
} from "@/game/types";
import {CONTINENT_META, META} from "@/game/meta";
import {Rng} from "@/game/rng";


// TODO neutral armies
export function newGame(rng: Rng, players: Player[]): Omit<GameState, 'id'> {
    // TODO randomize this
    const firstPlayer = 1

    const territories = Object.fromEntries(Object.keys(META).map(k => [k, { owner: null }])) as Record<TerritoryName, TerritoryState>
    draft(rng, territories, players.length)

    return {
        dateStarted: new Date(),
        dateUpdated: new Date(),
        version: 0,
        turnNumber: 1,
        players,
        turn: newTurn(firstPlayer, territories),
        territories
    }
}

// TODO starting as player 2 in a 2-player game => +3 armies on first turn
function newTurn(playerId: number, territories: TerritoryStateMap): TurnState {
    const deployment = nextDeployment(playerId, territories)
    return {
        playerId,
        phase: 'deploy',
        selected: null,
        armiesRemaining: deployment.total,
        provisional: null
    }
}

function nextDeployment(playerId: number, territories: TerritoryStateMap): AvailableDeployment {
    const controlled = Object.entries(territories)
        .filter(([,ts]) => ts.owner === playerId)
        .map(([tn,]) => tn as TerritoryName)

    const territoryBonus = Math.max(3, Math.floor(controlled.length / 3))

    const continentBonuses = Object.fromEntries(
        Object.entries(CONTINENT_META)
            .map(([continent, meta]) => {
                const continentControlled = controlled.filter(tn => META[tn].continent === continent).length
                const continentBonus =  continentControlled >= meta.territoryCount ? meta.controlBonus : 0
                return [continent as ContinentName, continentBonus] as const
            })
    ) as Record<ContinentName, number>

    return {
        territoryBonus,
        ...continentBonuses,
        total: territoryBonus + Object.values(continentBonuses).reduce((a, b) => a + b),
    }
}


function startingArmies(playerCount: number) {
    switch (playerCount) {
        case 2:
            return 40
        case 3:
            return 35
        case 4:
            return 30
        case 5:
            return 25
        case 6:
            return 20
        default:
            throw new Error(`unsupported number of players ${playerCount}`)
    }
}

function draft(rng: Rng, territories: Record<TerritoryName, TerritoryState>, playerCount: number) {
    const playerArmies = new Array<number>(playerCount).fill(startingArmies(playerCount))
    const keys = Object.keys(territories) as TerritoryName[]
    rng.shuffle(keys)

    let playerIndex = 0
    for (let key of keys) {
        territories[key] = { owner: playerIndex + 1, armies: 1 } as OccupiedTerritoryState
        playerArmies[playerIndex] -= 1
        playerIndex = (playerIndex + 1) % playerCount
    }

    for (let playerIndex = 0; playerIndex < playerCount; playerIndex++) {
        const playerId = playerIndex + 1
        const playerTerritories = Object.values(territories)
            .filter(t => t.owner === playerId) as OccupiedTerritoryState[]
        for (let armyId = 0; armyId < playerArmies[playerIndex]; armyId++) {
            rng.pick(playerTerritories).armies++
        }
    }
}


export class Game {
    constructor(
        private readonly playerId: number,
        private readonly state: GameState
    ) {}

    private isActive = this.state.turn.playerId === this.playerId

    get id() {
        return this.state.id
    }

    clone() {
        return new Game(this.playerId, this.state)
    }

    get territories(): Record<TerritoryName, TerritoryState> {
        return { ...this.state.territories }
    }

    get player(): Player {
        return this.player
    }

    get playerTurn(): TurnState | null {
        if (!this.isActive) {
            return null
        }
        return this.state.turn
    }

    get selectedTerritory(): TerritoryName | null {
        if (!this.isActive) {
            return null
        }
        switch (this.state.turn.phase) {
            case "deploy":
                return this.state.turn.selected
            case "attack":
                throw new Error('not implemented')
            case "fortify":
                throw new Error('not implemented')
        }
    }

    sync(serverState: GameState): Game {
        if (serverState.version > this.state.version) {
            this.state.version = serverState.version
            this.state.turn = serverState.turn
            return this.clone()
        }
        return this
    }

    deSelect(): Game {
        if (!this.isActive) {
            return this
        }

        const turn = this.state.turn
        switch (turn.phase) {
            case "deploy":
                if (turn.selected || turn.provisional) {
                    turn.selected = null
                    turn.provisional = null
                    return this.clone()
                }
                return this
            case "attack":
                throw new Error('not implemented')
            case "fortify":
                throw new Error('not implemented')
        }
    }

    allowSelect(name: TerritoryName): boolean {
        if (!this.isActive) {
            return false
        }
        switch (this.state.turn.phase) {
            case "deploy":
                return this.isOwned(name)
            case "attack":
                throw new Error('not implemented')
            case "fortify":
                throw new Error('not implemented')
        }
    }

    selectTerritory(name: TerritoryName): Game {
        if (!this.allowSelect(name)) {
            return this
        }

        switch (this.state.turn.phase) {
            case "deploy":
                if (this.state.turn.selected !== name) {
                    this.state.turn.selected = name
                    return this.clone()
                }
                return this
            case "attack":
                throw new Error('not implemented')
            case "fortify":
                throw new Error('not implemented')
        }
    }

    provisionallyDeployArmies(armies: number): Game {
        if (!this.isActive || this.state.turn.phase !== 'deploy' || !this.state.turn.selected) {
            return this
        }

        this.state.turn.provisional = {
            phase: 'deploy',
            playerId: this.playerId,
            territory: this.state.turn.selected,
            armies,
        }
        return this.clone()
    }

    private isOwned(name: TerritoryName): boolean {
        return this.state.territories[name].owner === this.playerId
    }
}
