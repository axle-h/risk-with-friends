import {DraftSummary, draftSummary, draft} from '@/game/draft';
import {PureRandRng} from '@/game/rng';

describe('draft', () => {
    it('drafts a valid 2-player board', () => {
        const rng = new PureRandRng(100)
        const territories = draft(rng, 2)

        expect(draftSummary(territories)).toStrictEqual([
            { territories: 21, armies: 40, playerOrdinal: 1 },
            { territories: 21, armies: 40, playerOrdinal: 2 }
        ] as DraftSummary[])

        expect(territories).toStrictEqual(
            {
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
        )
    })


})