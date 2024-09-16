import {
    AvailableDeployment,
    GameState,
    OccupiedTerritoryState,
    Player,
    TerritoryState, TerritoryStateMap,
    TurnState
} from "@/game/types"
import {
    AttackAction,
    ContinentName, DeployAction, FortifyAction,
    TerritoryName, UpdateGame,
} from "@/game/schema";
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
        armiesRemaining: deployment.total
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

    get gameState() {
        return this.state
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
                return this.state.turn.selected?.territory || null
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

    update(update: UpdateGame): Game | string {
        if (!this.isActive) {
            return 'not your turn'
        }

        switch (update.type) {
            case "deploy":
                return this.deployAction(update)
            case "attack":
                return this.attackAction(update)
            case "fortify":
                return this.fortifyAction(update)
        }
    }

    private deployAction(action: DeployAction): Game | string {
        if (this.state.turn.phase !== 'deploy') {
            return 'not in the deploy phase'
        }
        if (action.armies > this.state.turn.armiesRemaining) {
            return 'not enough armies remaining'
        }

        const territory = this.state.territories[action.territory]
        if (territory.owner !== this.playerId) {
            return 'you do not own this territory'
        }
        territory.armies += action.armies
        this.state.turn.armiesRemaining -= action.armies
        return this.clone()
    }

    private attackAction(update: AttackAction): Game | string {
        throw new Error('not implemented')
    }

    private fortifyAction(update: FortifyAction): Game | string {
        throw new Error('not implemented')

    }

    deSelect(): Game {
        if (!this.isActive) {
            return this
        }

        const turn = this.state.turn
        switch (turn.phase) {
            case "deploy":
                if (turn.selected) {
                    turn.selected = null
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

    selectTerritory(territory: TerritoryName): Game {
        if (!this.allowSelect(territory)) {
            return this
        }

        const turn = this.state.turn
        switch (turn.phase) {
            case "deploy":
                if (turn.selected?.territory !== territory) {
                    turn.selected = {
                        territory,
                        armies: turn.armiesRemaining
                    }
                    return this.clone()
                }
                return this
            case "attack":
                throw new Error('not implemented')
            case "fortify":
                throw new Error('not implemented')
        }
    }

    selectDeployment(armies: number): Game {
        if (!this.isActive || this.state.turn.phase !== 'deploy' || !this.state.turn.selected) {
            return this
        }

        if (this.state.turn.selected.armies !== armies) {
            this.state.turn.selected.armies = armies
            return this.clone()
        }
        return this
    }

    private isOwned(name: TerritoryName): boolean {
        return this.state.territories[name].owner === this.playerId
    }
}
