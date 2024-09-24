import {TerritoryStateMap} from "@/game/types";
import {TerritoryName} from "@/game/schema";
import {META} from "@/game/meta";

export type Route = TerritoryName[]

export function findShortestRoute(territories: TerritoryStateMap, start: TerritoryName, end: TerritoryName): Route | null {
    const { owner } = territories[start]
    if (!owner || owner !== territories[end].owner) {
        return null
    }

    function bordersOf(territory: TerritoryName): Route {
        const borders: Route = META[territory].borders.map(b => typeof b === 'string' ? b : b.name)
        return borders.filter(b => territories[b].owner === owner)
    }

    let result: Route | null = null
    const toVisit = bordersOf(start).map(border => [start, border])
    while (toVisit.length > 0) {
        const route = toVisit.pop()
        if (!route) {
            break
        }

        const head = route[route.length - 1]
        if (head === end) {
            if (!result || result.length > route.length) {
                result = route
            }
            continue
        }

        const borders = bordersOf(head).filter(b => !route.includes(b))
        if (borders.length === 0) {
            // discard this route
            continue
        }

        for (let border of borders) {
            toVisit.push([...route, border])
        }
    }

    return result
}