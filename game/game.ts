import {
    Action,
    GameState,
    Player,
    TerritoryStateMap,
    TurnState
} from "@/game/types"
import {
    TerritoryName
} from "@/game/schema"
import {updateState} from "@/game/state"


export class Game {
    constructor(
        private readonly playerOrdinal: number,
        private readonly state: GameState
    ) {}

    private get isActive() {
        return this.state.turn.playerOrdinal === this.playerOrdinal
    }

    get id() {
        return this.state.id
    }

    get gameState() {
        return this.state
    }

    clone() {
        return new Game(this.playerOrdinal, this.state)
    }

    get territories(): TerritoryStateMap {
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
            default:
                throw new Error('not implemented')
        }
    }

    sync(serverState: GameState): Game {
        if (serverState.events.length > this.state.events.length) {
            return new Game(this.playerOrdinal, serverState)
        }
        return this
    }

    update(update: Action): Game | string {
        if (!this.isActive) {
            return 'not your turn'
        }
        return new Game(this.playerOrdinal, updateState(this.state, update))
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
            default:
                throw new Error('not implemented')
        }
    }

    allowSelect(name: TerritoryName): boolean {
        if (!this.isActive) {
            return false
        }
        switch (this.state.turn.phase) {
            case "deploy":
                return this.isOccupied(name)
            default:
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
            default:
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

    private isOccupied(name: TerritoryName): boolean {
        return this.state.territories[name].owner === this.playerOrdinal
    }
}
