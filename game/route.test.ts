import {draft} from "@/game/draft";
import {PureRandRng} from "@/game/rng";
import {findShortestRoute, Route} from "@/game/route";
import {TerritoryName} from "@/game/schema";
import {META} from "@/game/meta";

describe('route', () => {
    function expectShortestRoute(owner: number, start: TerritoryName, end: TerritoryName, expected: TerritoryName[] | null) {
        const territories = draft(new PureRandRng(100), 2)
        const route = findShortestRoute(territories, start, end)
        expect(route).toStrictEqual(expected)

        if (route) {
            for (let territory of route) {
                expect(territories[territory].owner).toBe(owner)
            }
        }
    }

    it('routes to neighbouring territories', () => {
        expectShortestRoute(1, 'venezuela', 'brazil', ['venezuela', 'brazil'])
    })

    it('routes to close territories', () => {
        expectShortestRoute(1, 'argentina', 'venezuela', ['argentina', 'peru', 'venezuela'])
    })

    it('finds a long route for player 1', () => {
        expectShortestRoute(1, 'greenland', 'india', [
            'greenland',
            'northwest_territory',
            'alaska',
            'kamchatka',
            'mongolia',
            'china',
            'india'
        ])
    })

    it('finds a long route for player 2', () => {
        expectShortestRoute(2, 'iceland', 'irkutsk', [
            'iceland',
            'great_britain',
            'western_europe',
            'southern_europe',
            'middle_east',
            'afghanistan',
            'ural',
            'siberia',
            'irkutsk'
        ])
    })

    it('cannot find a route to another player\'s territory', () => {
        expectShortestRoute(1, 'argentina', 'central_america', null)
    })

    it('no route overflows', () => {
        let count = 0
        const territories = draft(new PureRandRng(100), 2)
        for (let start of Object.keys(META) as TerritoryName[]) {
            for (let end of Object.keys(META) as TerritoryName[]) {
                if (start !== end && territories[start].owner === territories[end].owner && findShortestRoute(territories, start, end)) {
                    count += 1
                }
            }
        }
        expect(count).toBeGreaterThan(0)
    })
})