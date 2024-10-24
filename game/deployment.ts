import {ContinentName, TerritoryName} from "@/game/schema";
import {TerritoryStateMap} from "@/game/types";
import {CONTINENT_META, META} from "@/game/meta";

export interface AvailableDeployment {
    territoriesOccupied: number
    territoryBonus: number
    continentBonuses: Record<ContinentName, number>
    total: number
}

export function nextDeployment(playerOrdinal: number, territories: TerritoryStateMap): AvailableDeployment {
    const territoriesOccupied = Object.entries(territories)
        .filter(([,ts]) => ts.owner === playerOrdinal)
        .map(([tn,]) => tn as TerritoryName)

    const territoryBonus = Math.max(3, Math.floor(territoriesOccupied.length / 3))

    const continentBonuses = Object.fromEntries(
        Object.entries(CONTINENT_META)
            .map(([continent, meta]) => {
                const continentControlled = territoriesOccupied.filter(tn => META[tn].continent === continent).length
                const continentBonus =  continentControlled >= meta.territoryCount ? meta.controlBonus : 0
                return [continent as ContinentName, continentBonus] as const
            })
    ) as Record<ContinentName, number>

    return {
        territoryBonus,
        territoriesOccupied: territoriesOccupied.length,
        continentBonuses,
        total: territoryBonus + Object.values(continentBonuses).reduce((a, b) => a + b),
    }
}