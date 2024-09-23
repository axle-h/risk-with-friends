import {TerritoryStateMap} from "@/game/types";
import {newTerritories} from "@/game/draft";
import {TerritoryName} from "@/game/schema";
import {AvailableDeployment, nextDeployment} from "@/game/deployment";
import {META} from "@/game/meta";

const PLAYER = 1

describe('deployment', () => {
    function territories(...owned: TerritoryName[]): TerritoryStateMap {
        const territories = newTerritories()
        for (let [territory, state] of Object.entries(territories)) {
            state.owner = owned.includes(territory as TerritoryName) ? PLAYER : PLAYER + 1
            state.armies = 1
        }
        return territories
    }

    it('deploys at least 3 armies', () => {
        const deployment = nextDeployment(PLAYER, territories('alberta'))
        expect(deployment).toStrictEqual({
            africa: 0,
            asia: 0,
            europe: 0,
            north_america: 0,
            oceana: 0,
            south_america: 0,
            territoryBonus: 3,
            total: 3
        } as AvailableDeployment)
    })

    it('deploys an army for every 3 territories owned (11 = 3)', () => {
        const deployment = nextDeployment(PLAYER, territories(
            'alberta', 'alaska', 'afghanistan', 'brazil', 'argentina', 'northwest_territory', 'kamchatka',
            'japan', 'mongolia', 'irkutsk', 'central_america'
        ))
        expect(deployment).toStrictEqual({
            africa: 0,
            asia: 0,
            europe: 0,
            north_america: 0,
            oceana: 0,
            south_america: 0,
            territoryBonus: 3,
            total: 3
        } as AvailableDeployment)
    })

    it('deploys an army for every 3 territories owned (12 = 4)', () => {
        const deployment = nextDeployment(PLAYER, territories(
            'alberta', 'alaska', 'afghanistan', 'brazil', 'argentina', 'northwest_territory', 'kamchatka',
            'japan', 'mongolia', 'irkutsk', 'central_america', 'china'
        ))
        expect(deployment).toStrictEqual({
            africa: 0,
            asia: 0,
            europe: 0,
            north_america: 0,
            oceana: 0,
            south_america: 0,
            territoryBonus: 4,
            total: 4
        } as AvailableDeployment)
    })

    it('deploys an army for every 3 territories owned (13 = 4)', () => {
        const deployment = nextDeployment(PLAYER, territories(
            'alberta', 'alaska', 'afghanistan', 'brazil', 'argentina', 'northwest_territory', 'kamchatka',
            'japan', 'mongolia', 'irkutsk', 'central_america', 'china', 'north_africa'
        ))
        expect(deployment).toStrictEqual({
            africa: 0,
            asia: 0,
            europe: 0,
            north_america: 0,
            oceana: 0,
            south_america: 0,
            territoryBonus: 4,
            total: 4
        } as AvailableDeployment)
    })

    it('deploys 2 extra armies for occupying all of oceana', () => {
        const deployment = nextDeployment(PLAYER, territories(
            'eastern_australia', 'indonesia', 'new_guinea', 'western_australia'
        ))
        expect(deployment).toStrictEqual({
            africa: 0,
            asia: 0,
            europe: 0,
            north_america: 0,
            oceana: 2,
            south_america: 0,
            territoryBonus: 3,
            total: 5
        } as AvailableDeployment)
    })

    it('deploys 2 extra armies for occupying all of south america', () => {
        const deployment = nextDeployment(PLAYER, territories(
            'argentina', 'brazil', 'peru', 'venezuela'
        ))
        expect(deployment).toStrictEqual({
            africa: 0,
            asia: 0,
            europe: 0,
            north_america: 0,
            oceana: 0,
            south_america: 2,
            territoryBonus: 3,
            total: 5
        } as AvailableDeployment)
    })

    it('deploys 3 extra armies for occupying all of africa', () => {
        const deployment = nextDeployment(PLAYER, territories(
            'congo', 'east_africa', 'egypt', 'madagascar', 'north_africa', 'south_africa'
        ))
        expect(deployment).toStrictEqual({
            africa: 3,
            asia: 0,
            europe: 0,
            north_america: 0,
            oceana: 0,
            south_america: 0,
            territoryBonus: 3,
            total: 6
        } as AvailableDeployment)
    })

    it('deploys 5 extra armies for occupying all of europe', () => {
        const deployment = nextDeployment(PLAYER, territories(
            'great_britain', 'iceland', 'northern_europe', 'scandinavia', 'southern_europe', 'ukraine',
            'western_europe'
        ))
        expect(deployment).toStrictEqual({
            africa: 0,
            asia: 0,
            europe: 5,
            north_america: 0,
            oceana: 0,
            south_america: 0,
            territoryBonus: 3,
            total: 8
        } as AvailableDeployment)
    })

    it('deploys 5 extra armies for occupying all of north america', () => {
        const deployment = nextDeployment(PLAYER, territories(
            'alaska', 'alberta', 'central_america', 'eastern_united_states', 'greenland', 'northwest_territory',
            'ontario', 'quebec', 'western_united_states'
        ))
        expect(deployment).toStrictEqual({
            africa: 0,
            asia: 0,
            europe: 0,
            north_america: 5,
            oceana: 0,
            south_america: 0,
            territoryBonus: 3,
            total: 8
        } as AvailableDeployment)
    })

    it('deploys 7 extra armies for occupying all of asia', () => {
        const deployment = nextDeployment(PLAYER, territories(
            'afghanistan', 'china', 'india', 'irkutsk', 'japan', 'kamchatka', 'middle_east', 'mongolia', 'siam',
            'siberia', 'ural', 'yakutsk'
        ))
        expect(deployment).toStrictEqual({
            africa: 0,
            asia: 7,
            europe: 0,
            north_america: 0,
            oceana: 0,
            south_america: 0,
            territoryBonus: 4,
            total: 11
        } as AvailableDeployment)
    })

    it('world domination!', () => {
        const deployment = nextDeployment(PLAYER, territories(
            ...(Object.keys(META) as TerritoryName[])
        ))
        expect(deployment).toStrictEqual({
            africa: 3,
            asia: 7,
            europe: 5,
            north_america: 5,
            oceana: 2,
            south_america: 2,
            territoryBonus: 14,
            total: 38
        } as AvailableDeployment)
    })
})