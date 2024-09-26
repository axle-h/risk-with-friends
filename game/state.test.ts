import {newGameState} from "@/game/state";
import {Action, GameState, Player, TurnPhase, TurnState} from "@/game/types";
import {PureRandRng} from "@/game/rng";
import {draft} from "@/game/draft";
import {deploy, attack, endPhase, occupy, fortify, drawCard} from "@/game/factory";
import {Schema, TerritoryName} from "@/game/schema";

describe('game state', () => {
    const date = new Date(1)

    function havingState(...actions: Action[]) {
        const players: Player[] = [
            { ordinal: 1, username: 'alex', displayName: 'Alex Haslehurst', cards: [] },
            { ordinal: 2, username: 'someone', displayName: 'Someone Else', cards: [] }
        ]
        return newGameState(1, 100, players, actions, date)
    }

    function expectTerritory(state: GameState, territory: TerritoryName, owner: number, armies: number) {
        expect(state.territories[territory].owner).toBe(owner)
        expect(state.territories[territory].armies).toBe(armies)
    }

    it('creates empty state', () => {
        const rng = new PureRandRng(100)
        const territories = draft(rng, 2)
        const cards = Schema.CardName.options
        rng.shuffle(cards)

        expect(havingState()).toStrictEqual({
            id: 1,
            players: [
                { ordinal: 1, username: 'alex', displayName: 'Alex Haslehurst', cards: [] },
                { ordinal: 2, username: 'someone', displayName: 'Someone Else', cards: [] }
            ],
            turnNumber: 1,
            territories,
            cards,
            turn: {
                phase: 'deploy',
                playerOrdinal: 1,
                armiesRemaining: 9,
                selected: null,
            },
            events: [
                { type: 'draft', playerOrdinal: 1, date: date, armies: 40, territories: 21 },
                { type: 'draft', playerOrdinal: 2, date: date, armies: 40, territories: 21 },
                {
                    type: 'deployment',
                    playerOrdinal: 1,
                    date: date,
                    africa: 0,
                    asia: 0,
                    europe: 0,
                    north_america: 0,
                    oceana: 0,
                    south_america: 2,
                    territoryBonus: 7,
                    total: 9
                }
            ],
        } as GameState)
    })

    describe('end phase', () => {
        it('ends the deploy phase', () => {
            const action = endPhase(1, 'deploy')
            const state = havingState(action)

            expect(state.turn).toStrictEqual({
                phase: 'attack',
                playerOrdinal: 1,
                territoryCaptured: false
            } as TurnState)
            expect(state.events[3]).toBe(action)
        })

        it('cannot end the occupy phase', () => {
            expect(
                () => havingState(
                    deploy(1, 'northern_europe', 9),
                    endPhase(1, 'deploy'),
                    attack(1, 'northern_europe', 'great_britain', [1, 2, 4], [3]),
                    endPhase(1, 'occupy'),
                )
            ).toThrow('cannot end the occupy phase')
        })

        it('cannot end a phase as another player', () => {
            expect(
                () => havingState(
                    endPhase(2, 'deploy'),
                )
            ).toThrow('it is not player 2\'s turn')
        })

        it('advances to next turn', () => {
            const state = havingState(
                endPhase(1, 'deploy'),
                endPhase(1, 'attack'),
                endPhase(1, 'fortify')
            )

            expect(state.turn).toStrictEqual({
                phase: 'deploy',
                playerOrdinal: 2,
                selected: null,
                armiesRemaining: 7
            } as TurnState)
            expect(state.turnNumber).toBe(2)
        })

        it('cannot end a non-active phase', () => {
            expect(
                () => havingState(
                    { type: 'end_phase', date, playerOrdinal: 1, phase: 'attack' }
                )
            ).toThrow('not in the attack phase')
        })
    })

    describe('deployment', () => {
        it('can deploy armies to an occupied territory', () => {
            const action = deploy(1, 'alaska', 9)
            const state = havingState(action)

            expect(state.turn).toStrictEqual({
                phase: 'deploy',
                playerOrdinal: 1,
                armiesRemaining: 0,
                selected: null,
            } as TurnState)
            expect(state.events[3]).toBe(action)
            expectTerritory(state, 'alaska', 1, 4 + 9)
        })

        it('cannot deploy as another player', () => {
            expect(
                () => havingState(
                    deploy(2, 'alaska', 1)
                )
            ).toThrow('it is not player 2\'s turn')
        })

        it('cannot deploy in the attack phase', () => {
            expect(
                () => havingState(
                    endPhase(1, 'deploy'),
                    deploy(1, 'alaska', 1)
                )
            ).toThrow('not in the deploy phase')
        })

        it('cannot deploy in the fortify phase', () => {
            expect(
                () => havingState(
                    endPhase(1, 'deploy'),
                    endPhase(1, 'attack'),
                    deploy(1, 'alaska', 1)
                )
            ).toThrow('not in the deploy phase')
        })

        it('cannot deploy 0 armies', () => {
            expect(() => havingState(deploy(1, 'alaska', 0)))
                .toThrow('must deploy at least one army')
        })

        it('cannot deploy too many armies', () => {
            expect(() => havingState(deploy(1, 'alaska', 10)))
                .toThrow('cannot deploy 10 armies as only have 9 remaining')
        })

        it('cannot deploy to an unoccupied territory', () => {
            expect(() => havingState(deploy(1, 'central_america', 1)))
                .toThrow('central_america is not occupied')
        })
    })

    describe('attack', () => {

        it('attacks and occupies with reserve armies', () => {
            const state = havingState(
                deploy(1, 'northern_europe', 9),
                endPhase(1, 'deploy'),
                attack(1, 'northern_europe', 'great_britain', [1, 2, 4], [3])
            )

            expect(state.turn).toStrictEqual({
                phase: 'occupy',
                playerOrdinal: 1,
                territoryFrom: 'northern_europe',
                territoryTo: 'great_britain',
                minArmies: 3,
                maxArmies: 2 + 9 - 1,
                selectedArmies: 2 + 9 - 1,
            } as TurnState)
            expect(state.events[state.events.length - 1].type).toBe('territory_occupied')

            expectTerritory(state, 'northern_europe', 1, 2 + 9)
            expectTerritory(state, 'great_britain', 1, 0)
        })

        it('attacks and occupies with no reserve armies', () => {
            const state = havingState(
                endPhase(1, 'deploy'),
                attack(1, 'northern_europe', 'great_britain', [4], [3])
            )

            expect(state.turn).toStrictEqual({
                phase: 'attack',
                playerOrdinal: 1,
                territoryCaptured: true
            } as TurnState)

            expectTerritory(state, 'northern_europe', 1, 1)
            expectTerritory(state, 'great_britain', 1, 1)
        })

        it('attacks without any occupation', () => {
            const state = havingState(
                deploy(1, 'northern_europe', 9),
                endPhase(1, 'deploy'),
                attack(1, 'northern_europe', 'scandinavia', [1, 2, 4], [4, 1])
            )

            expect(state.turn).toStrictEqual({
                phase: 'attack',
                playerOrdinal: 1,
                territoryCaptured: false
            } as TurnState)

            expectTerritory(state, 'northern_europe', 1, 2 + 9 - 1)
            expectTerritory(state, 'scandinavia', 2, 4 - 1)
        })

        it('cannot attack as another player', () => {
            expect(
                () => havingState(
                    endPhase(1, 'deploy'),
                    attack(2, 'northern_europe', 'scandinavia', [1, 2, 4], [4, 1])
                )
            ).toThrow('it is not player 2\'s turn')
        })

        it('cannot attack in the deploy phase', () => {
            expect(
                () => havingState(
                    attack(1, 'northern_europe', 'scandinavia', [1, 2, 4], [4, 1])
                )
            ).toThrow('not in the attack phase')
        })

        it('cannot attack in the fortify phase', () => {
            expect(
                () => havingState(
                    endPhase(1, 'deploy'),
                    endPhase(1, 'attack'),
                    attack(1, 'northern_europe', 'scandinavia', [1, 2, 4], [4, 1])
                )
            ).toThrow('not in the attack phase')
        })

        it('cannot attack from an unoccupied territory', () => {
            expect(
                () => havingState(
                    endPhase(1, 'deploy'),
                    attack(1, 'scandinavia', 'great_britain', [1, 2, 4], [4, 1])
                )
            ).toThrow('cannot attack from scandinavia as it is not occupied')
        })

        it('cannot attack a territory that is already occupied', () => {
            expect(
                () => havingState(
                    endPhase(1, 'deploy'),
                    attack(1, 'alaska', 'yakutsk', [1, 2, 4], [4, 1])
                )
            ).toThrow('cannot attack yakutsk as it is already occupied')
        })

        it('cannot attack with more armies than are available', () => {
            expect(
                () => havingState(
                    endPhase(1, 'deploy'),
                    attack(1, 'new_guinea', 'eastern_australia', [1, 2], [4, 1])
                )
            ).toThrow('cannot attack with 2 armies from new_guinea as only 2 armies are deployed')
        })

        it('cannot defend with more armies that are available', () => {
            expect(
                () => havingState(
                    endPhase(1, 'deploy'),
                    attack(1, 'northern_europe', 'great_britain', [4], [3, 6])
                )
            ).toThrow('cannot defend great_britain with 2 armies as only 1 armies are deployed')
        })

        it('cannot attack a territory that does not share a border', () => {
            expect(
                () => havingState(
                    endPhase(1, 'deploy'),
                    attack(1, 'northern_europe', 'eastern_australia', [4], [3, 6])
                )
            ).toThrow('cannot attack from northern_europe to eastern_australia as they do not share a border')
        })

        it('cannot attack same territory', () => {
            expect(
                () => havingState(
                    endPhase(1, 'deploy'),
                    attack(1, 'northern_europe', 'northern_europe', [4], [3, 6])
                )
            ).toThrow('cannot attack northern_europe as it is already occupied')
        })
    })

    describe('occupy', () => {
        it('moves armies into an occupied territory', () => {
            const state = havingState(
                deploy(1, 'northern_europe', 9),
                endPhase(1, 'deploy'),
                attack(1, 'northern_europe', 'great_britain', [1, 2, 4], [3]),
                occupy(1, 10),
            )

            expect(state.turn).toStrictEqual({
                phase: 'attack',
                playerOrdinal: 1,
                territoryCaptured: true
            } as TurnState)

            expectTerritory(state, 'northern_europe', 1, 1)
            expectTerritory(state, 'great_britain', 1, 10)
        })

        it('cannot occupy in the deploy phase', () => {
            expect(
                () => havingState(
                    occupy(1, 10),
                )
            ).toThrow('not in the occupy phase')
        })

        it('cannot occupy in the attack phase', () => {
            expect(
                () => havingState(
                    endPhase(1, 'deploy'),
                    occupy(1, 10),
                )
            ).toThrow('not in the occupy phase')
        })

        it('cannot occupy in the fortify phase', () => {
            expect(
                () => havingState(
                    endPhase(1, 'deploy'),
                    endPhase(1, 'attack'),
                    occupy(1, 10),
                )
            ).toThrow('not in the occupy phase')
        })

        it('cannot move less than the minimum available armies', () => {
            expect(
                () => havingState(
                    deploy(1, 'northern_europe', 9),
                    endPhase(1, 'deploy'),
                    attack(1, 'northern_europe', 'great_britain', [1, 2, 4], [3]),
                    occupy(1, 2),
                )
            ).toThrow('must move at least 3 armies')
        })

        it('cannot move more than the maximum available armies', () => {
            expect(
                () => havingState(
                    deploy(1, 'northern_europe', 9),
                    endPhase(1, 'deploy'),
                    attack(1, 'northern_europe', 'great_britain', [1, 2, 4], [3]),
                    occupy(1, 11),
                )
            ).toThrow('cannot move more than 10 armies')
        })
    })

    describe('fortify', () => {
        it('moves armies between occupied territories', () => {
            const state = havingState(
                deploy(1, 'argentina', 9),
                endPhase(1, 'deploy'),
                endPhase(1, 'attack'),
                fortify(1, 'argentina', 'venezuela', 9)
            )

            expect(state.turn).toStrictEqual({
                phase: 'deploy',
                playerOrdinal: 2,
                armiesRemaining: 7,
                selected: null
            } as TurnState)

            expectTerritory(state, 'argentina', 1, 1)
            expectTerritory(state, 'venezuela', 1, 2 + 9)
        })

        it('cannot move armies back to the same territory', () => {
            expect(
                () => havingState(
                    deploy(1, 'argentina', 9),
                    endPhase(1, 'deploy'),
                    endPhase(1, 'attack'),
                    fortify(1, 'argentina', 'argentina', 9)
                )
            ).toThrow('cannot move armies back to the same territory')
        })

        it('cannot move armies from an unoccupied territory', () => {
            expect(
                () => havingState(
                    endPhase(1, 'deploy'),
                    endPhase(1, 'attack'),
                    fortify(1, 'great_britain', 'northern_europe', 9)
                )
            ).toThrow('annot move armies from great_britain as it is not occupied')
        })

        it('cannot move armies to an unoccupied territory', () => {
            expect(
                () => havingState(
                    endPhase(1, 'deploy'),
                    endPhase(1, 'attack'),
                    fortify(1, 'northern_europe', 'great_britain', 9)
                )
            ).toThrow('annot move armies to great_britain as it is not occupied')
        })

        it('cannot move more than the maximum available armies', () => {
            expect(
                () => havingState(
                    deploy(1, 'argentina', 9),
                    endPhase(1, 'deploy'),
                    endPhase(1, 'attack'),
                    fortify(1, 'argentina', 'venezuela', 10)
                )
            ).toThrow('cannot move 10 armies from argentina as only 10 armies are deployed')
        })

        it('cannot move where no route is available', () => {
            expect(
                () => havingState(
                    deploy(1, 'argentina', 9),
                    endPhase(1, 'deploy'),
                    endPhase(1, 'attack'),
                    fortify(1, 'argentina', 'northern_europe', 9)
                )
            ).toThrow('cannot move armies from argentina to northern_europe as there is no available route')
        })
    })


    describe('cards', () => {
        it('draws a card', () => {
            const state = havingState(
                deploy(1, 'northern_europe', 9),
                endPhase(1, 'deploy'),
                attack(1, 'northern_europe', 'great_britain', [1, 2, 4], [3]),
                occupy(1, 10),
                drawCard(1, 'afghanistan')
            )

            expect(state.turn).toStrictEqual({
                phase: 'fortify',
                playerOrdinal: 1,
            } as TurnState)

            expect(state.players[0].cards).toStrictEqual(['afghanistan'])
        })

        it('cannot draw a card in the deploy phase', () => {
            expect(
                () => havingState(
                    drawCard(1, 'afghanistan')
                )
            ).toThrow('not in the attack phase')
        })

        it('cannot draw a card in the fortify phase', () => {
            expect(
                () => havingState(
                    endPhase(1, 'deploy'),
                    endPhase(1, 'attack'),
                    drawCard(1, 'afghanistan')
                )
            ).toThrow('not in the attack phase')
        })

        it('can only draw a card when a territory has been occupied', () => {
            expect(
                () => havingState(
                    endPhase(1, 'deploy'),
                    drawCard(1, 'afghanistan')
                )
            ).toThrow('can only draw a card when a territory has been occupied')
        })

        it('must draw a card when a territory has been occupied', () => {
            expect(
                () => havingState(
                    deploy(1, 'northern_europe', 9),
                    endPhase(1, 'deploy'),
                    attack(1, 'northern_europe', 'great_britain', [1, 2, 4], [3]),
                    occupy(1, 10),
                    endPhase(1, 'attack')
                )
            ).toThrow('expected to draw a card but none drawn')
        })


        it.todo('turns in a set of cards')
    })
})