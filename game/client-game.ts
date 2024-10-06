import {
    GameState,
    Player,
    TerritoryStateMap,
    TurnState
} from "@/game/types"
import {
    NewAction,
    TerritoryName
} from "@/game/schema"


export class ClientGame {
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
        return new ClientGame(this.playerOrdinal, this.state)
    }

    get territories(): TerritoryStateMap {
        return { ...this.state.territories }
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

    sync(serverState: GameState): ClientGame {
        if (serverState.events.length > this.state.events.length) {
            return new ClientGame(this.playerOrdinal, serverState)
        }
        return this
    }

    update(update: NewAction): ClientGame | string {
        if (!this.isActive) {
            return 'not your turn'
        }
        return new ClientGame(this.playerOrdinal, updateState(this.state, update))
    }

    deSelect(): ClientGame {
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

    selectTerritory(territory: TerritoryName): ClientGame {
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

    private isOccupied(name: TerritoryName): boolean {
        return this.state.territories[name].owner === this.playerOrdinal
    }
}
