import {TerritoryState, TerritoryStateMap} from "@/game/types";
import {META} from "@/game/meta";

export function startingArmies(playerCount: number) {
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

export function newTerritories(): TerritoryStateMap {
    return Object.fromEntries(Object.keys(META)
        .map(k => [k, { owner: null, armies: 0 } as TerritoryState])) as TerritoryStateMap
}

export function draftSummary(territories: TerritoryStateMap): DraftSummary[] {
    const summary = Object.entries(territories).reduce((obj, [tn, ts]) => {
        if (!ts.owner) {
            return obj
        }
        const ownership = obj[ts.owner]
        if (!ownership) {
            obj[ts.owner] = { armies: ts.armies, territories: 1, playerOrdinal: ts.owner }
        } else {
            ownership.territories++
            ownership.armies += ts.armies
        }
        return obj
    }, {} as Record<number, DraftSummary>)
    return Object.values(summary)
}

export interface DraftSummary {
    playerOrdinal: number
    territories: number
    armies: number
}