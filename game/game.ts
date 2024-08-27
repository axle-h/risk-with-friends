import {GameState, OccupiedTerritoryState, Player, TerritoryName, TerritoryState} from "@/game/types";
import {META} from "@/game/meta";
import {Rng} from "@/game/rng";


export function newGame(rng: Rng, players: Player[]): Omit<GameState, 'id'> {
    const territories = Object.fromEntries(Object.keys(META).map(k => [k, { owner: null }])) as Record<TerritoryName, TerritoryState>
    draft(rng, territories, players.length)
    return {
        dateStarted: new Date(),
        dateUpdated: new Date(),
        version: 0,
        turnNumber: 1,
        players,
        turn: {
            playerId: 1,
            phase: 'deploy',
            selected: null
        },
        territories
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

// TODO starting as player 2 in a 2-player game => +3 armies on first turn
// TODO neutral armies
export class Game {
    constructor(
        private readonly playerId: number,
        private readonly state: GameState
    ) {}

    get id() {
        return this.state.id
    }

    clone() {
        return new Game(this.playerId, this.state)
    }

    get territories(): Record<TerritoryName, TerritoryState> {
        return { ...this.state.territories }
    }

    get selectedTerritory(): TerritoryName | null {
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
        if (this.state.turn.playerId !== this.playerId) {
            return this
        }

        switch (this.state.turn.phase) {
            case "deploy":
                if (this.state.turn.selected !== null) {
                    this.state.turn.selected = null
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
        return true
        if (this.state.turn.playerId !== this.playerId) {
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

    private isOwned(name: TerritoryName): boolean {
        return this.state.territories[name].owner === this.playerId
    }
}

