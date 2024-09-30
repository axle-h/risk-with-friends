import {DraftSummary, draftSummary} from '@/game/draft';
import {PureGameRng} from '@/game/rng';
import {TerritoryStateMap} from "@/game/types";
import {CardName} from "@/game/schema";

export const TEST_TERRITORIES: TerritoryStateMap = {
    eastern_australia: {
        owner: 2,
        armies: 2
    },
    indonesia: {
        owner: 2,
        armies: 2
    },
    new_guinea: {
        owner: 1,
        armies: 2
    },
    alaska: {
        owner: 1,
        armies: 4
    },
    ontario: {
        owner: 2,
        armies: 2
    },
    northwest_territory: {
        owner: 1,
        armies: 2
    },
    venezuela: {
        owner: 1,
        armies: 2
    },
    madagascar: {
        owner: 1,
        armies: 1
    },
    north_africa: {
        owner: 2,
        armies: 2
    },
    greenland: {
        owner: 1,
        armies: 1
    },
    iceland: {
        owner: 2,
        armies: 2
    },
    great_britain: {
        owner: 2,
        armies: 1
    },
    scandinavia: {
        owner: 2,
        armies: 4
    },
    japan: {
        owner: 1,
        armies: 2
    },
    yakutsk: {
        owner: 1,
        armies: 2
    },
    kamchatka: {
        owner: 1,
        armies: 1
    },
    siberia: {
        owner: 2,
        armies: 1
    },
    ural: {
        owner: 2,
        armies: 4
    },
    afghanistan: {
        owner: 2,
        armies: 3
    },
    middle_east: {
        owner: 2,
        armies: 2
    },
    india: {
        owner: 1,
        armies: 5
    },
    siam: {
        owner: 1,
        armies: 3
    },
    china: {
        owner: 1,
        armies: 2
    },
    mongolia: {
        owner: 1,
        armies: 2
    },
    irkutsk: {
        owner: 2,
        armies: 2
    },
    ukraine: {
        owner: 1,
        armies: 1
    },
    southern_europe: {
        owner: 2,
        armies: 1
    },
    western_europe: {
        owner: 2,
        armies: 1
    },
    northern_europe: {
        owner: 1,
        armies: 2
    },
    egypt: {
        owner: 1,
        armies: 1
    },
    east_africa: {
        owner: 2,
        armies: 1
    },
    congo: {
        owner: 2,
        armies: 3
    },
    south_africa: {
        owner: 2,
        armies: 1
    },
    brazil: {
        owner: 1,
        armies: 2
    },
    argentina: {
        owner: 1,
        armies: 1
    },
    eastern_united_states: {
        owner: 2,
        armies: 2
    },
    western_united_states: {
        owner: 1,
        armies: 1
    },
    quebec: {
        owner: 2,
        armies: 1
    },
    central_america: {
        owner: 2,
        armies: 1
    },
    peru: {
        owner: 1,
        armies: 1
    },
    western_australia: {
        owner: 1,
        armies: 2
    },
    alberta: {
        owner: 2,
        armies: 2
    }
}

// TODO shuffle this
export const TEST_CARDS: CardName[] = [
    'indonesia',
    'middle_east',
    'eastern_australia',
    'mongolia',
    'siberia',
    'japan',
    'madagascar',
    'central_america',
    'western_europe',
    'wild2',
    'irkutsk',
    'ukraine',
    'peru',
    'congo',
    'east_africa',
    'yakutsk',
    'northern_europe',
    'india',
    'eastern_united_states',
    'argentina',
    'south_africa',
    'ontario',
    'northwest_territory',
    'brazil',
    'ural',
    'alaska',
    'venezuela',
    'siam',
    'greenland',
    'afghanistan',
    'kamchatka',
    'southern_europe',
    'western_australia',
    'wild1',
    'alberta',
    'north_africa',
    'quebec',
    'new_guinea',
    'china',
    'scandinavia',
    'iceland',
    'western_united_states',
    'great_britain',
    'egypt',
]

describe('rng', () => {
    it('drafts a valid 2-player board', () => {
        const territories = PureGameRng.fromSeed(100).draft(2)

        expect(draftSummary(territories)).toStrictEqual([
            { territories: 21, armies: 40, playerOrdinal: 1 },
            { territories: 21, armies: 40, playerOrdinal: 2 }
        ] as DraftSummary[])

        expect(territories).toStrictEqual(TEST_TERRITORIES)
    })


})