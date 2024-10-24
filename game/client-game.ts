import {
    GameState, TerritoryState,
    TerritoryStateMap, TurnPhase,
    TurnState
} from "@/game/types"
import {
    NewAction,
    TerritoryName
} from "@/game/schema"
import {updateGame} from "@/state/client";
import {borderTerritories, territoriesAreAdjacent} from "@/game/meta";
import {findShortestRoute, Route} from "@/game/route";


export class ClientGame {
    constructor(
        private readonly playerOrdinal: number,
        private readonly state: GameState
    ) {}

    get isMyTurn() {
        return this.state.turn.playerOrdinal === this.playerOrdinal
    }

    get id() {
        return this.state.id
    }

    clone() {
        return new ClientGame(this.playerOrdinal, this.state)
    }

    get events() {
        return [...this.state.events]
    }

    territory(name: TerritoryName): TerritoryState {
        const territory = { ...this.state.territories[name] }
        const { turn } = this.state
        switch (turn?.phase) {
            case 'deploy':
                if (turn.selected?.territory === name) {
                    territory.armies += turn.selected.armies
                }
                break
            case 'occupy':
                if (turn.territoryFrom === name) {
                    territory.armies -= turn.selectedArmies
                } else if (turn.territoryTo === name) {
                    territory.armies += turn.selectedArmies
                }
                break
            case 'fortify':
                if (turn.selected?.route) {
                    const route = turn.selected?.route
                    if (route[0] === name) {
                        territory.armies -= turn.selected.armies
                    } else if (route[route.length - 1] === name) {
                        territory.armies += turn.selected.armies
                    }
                }
                break
        }
        return territory
    }

    get playerTurn(): TurnState {
        return this.state.turn
    }

    get selectedTerritories(): Route {
        if (!this.isMyTurn) {
            return []
        }
        const result: Route = []
        const { turn } = this.state
        switch (turn.phase) {
            case "deploy":
                if (turn.selected?.territory) {
                    result.push(turn.selected.territory)
                }
                break
            case 'attack':
                if (turn.selected?.territoryFrom) {
                    result.push(turn.selected.territoryFrom)
                }
                if (turn.selected?.territoryTo) {
                    result.push(turn.selected.territoryTo)
                }
                break
            case 'occupy':
                result.push(turn.territoryFrom)
                result.push(turn.territoryTo)
                break
            case 'fortify':
                if (turn.selected) {
                    const { territoryFrom, route } = turn.selected
                    result.push(territoryFrom)
                    if (route) {
                        result.push(route[route.length - 1])
                    }
                }
                break
        }
        return result
    }

    sync(serverState: GameState): ClientGame {
        if (serverState.events.length > this.state.events.length) {
            return new ClientGame(this.playerOrdinal, serverState)
        }
        return this
    }

    async update(newAction: NewAction): Promise<ClientGame> {
        if (!this.isMyTurn) {
            return this
        }

        try {
            const newState = await updateGame(this.state.id, newAction)
            if (newState === null) {
                console.error('server cannot find game')
                return this
            }
            return new ClientGame(this.playerOrdinal, newState)
        } catch (error) {
            console.error('could not update local game', error)
            return this
        }
    }

    deSelect(): ClientGame {
        if (!this.isMyTurn) {
            return this
        }

        const turn = this.state.turn
        switch (turn.phase) {
            case "deploy":
            case "attack":
            case "fortify":
                if (turn.selected) {
                    delete turn.selected
                    return this.clone()
                }
                return this
            case 'occupy':
                // cannot deselect in occupy
                return this
        }
    }

    allowSelect(territory: TerritoryName): boolean {
        if (!this.isMyTurn) {
            return false
        }
        const turn = this.state.turn
        const occupied = this.isOccupied(territory)
        switch (turn.phase) {
            case "deploy":
                return occupied
            case 'attack':
                if (occupied) {
                    // select territory from
                    return true
                }
                if (!turn.selected) {
                    return false // cannot attack from unoccupied territory
                }
                // cannot attack territory that is not adjacent
                return turn.selected.availableAttacking > 0 && turn.selected.adjacentUnoccupiedTerritories.includes(territory)
            case 'occupy':
                // cannot select in occupy
                return false
            case 'fortify':
                if (!occupied) {
                    // can only fortify from or to occupied territories
                    return false
                }
                if (!turn.selected) {
                    return this.state.territories[territory].armies > 1 // selecting territoryFrom
                }
                // cannot fortify a territory that does not have a route
                return findShortestRoute(this.state.territories, turn.selected.territoryFrom, territory) !== null
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
            case 'attack':
                if (this.isOccupied(territory)) {
                    // select territory from
                    turn.selected = {
                        territoryFrom: territory,
                        availableAttacking: Math.min(this.state.territories[territory].armies - 1, 3),
                        adjacentUnoccupiedTerritories: borderTerritories(territory)
                            .filter(t => !this.isOccupied(t)),
                        territoryTo: null
                    }
                    return this.clone()
                } else if (turn.selected) {
                    turn.selected.territoryTo = territory
                    return this.clone()
                }
                return this
            case 'occupy':
                return this
            case 'fortify':
                if (!this.isOccupied(territory)) {
                    return this
                }
                if (!turn.selected) {
                    const availableArmies = this.state.territories[territory].armies - 1
                    turn.selected = {
                        territoryFrom: territory,
                        availableArmies,
                        route: null,
                        armies: availableArmies
                    }
                } else {
                    turn.selected.route = findShortestRoute(this.state.territories, turn.selected.territoryFrom, territory)
                }
                return this.clone()

        }
    }

    setDeployment(armies: number): ClientGame {
        const { turn } = this.state
        if (!this.isMyTurn || turn.phase !== 'deploy' || !turn.selected || armies < 1 || armies > turn.armiesRemaining) {
            return this
        }
        turn.selected.armies = armies
        return this.clone()
    }

    setOccupy(armies: number): ClientGame {
        const { turn } = this.state
        if (!this.isMyTurn || turn.phase !== 'occupy' || armies < turn.minArmies || armies > turn.maxArmies) {
            return this
        }
        turn.selectedArmies = armies
        return this.clone()
    }

    setFortify(armies: number): ClientGame {
        const { turn } = this.state
        if (!this.isMyTurn || turn.phase !== 'fortify' || !turn.selected || armies < 1 || armies > turn.selected.availableArmies) {
            return this
        }
        turn.selected.armies = armies
        return this.clone()
    }

    private isOccupied(name: TerritoryName): boolean {
        return this.state.territories[name].owner === this.playerOrdinal
    }
}
