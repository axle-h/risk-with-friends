import {ServerGame} from "@/game/state";
import {DiceRoll, GameState, TurnState} from "@/game/types";
import {GameRng, FixedRng} from "@/game/rng";
import {deploy, attack, endPhase, occupy, fortify, turnInCards} from "@/game/factory";
import {CardName, TerritoryName} from "@/game/schema";
import {TEST_CARDS, TEST_TERRITORIES} from "@/game/rng.test";

describe('game state', () => {
    const date = new Date(1)

    function havingState(overrideRng?: GameRng) {
        return ServerGame.new(
            1,
            [
                { ordinal: 1, username: 'alex', displayName: 'Alex Haslehurst' },
                { ordinal: 2, username: 'someone', displayName: 'Someone Else' }
            ],
            overrideRng || rng(),
            date
        )
    }

    function rng(...dice: DiceRoll[]) {
        const territories = Object.entries(TEST_TERRITORIES)
            .map(([name, state]) => [name, { ...state }])
        return new FixedRng([...TEST_CARDS], dice, Object.fromEntries(territories))
    }

    function expectTerritory(state: GameState, territory: TerritoryName, owner: number, armies: number) {
        expect(state.territories[territory].owner).toBe(owner)
        expect(state.territories[territory].armies).toBe(armies)
    }

    describe('end phase', () => {
        it('ends the deploy phase', () => {
            const action = endPhase(1) // deploy
            const state = havingState().update(action).toState()

            expect(state.turn).toStrictEqual({
                phase: 'attack',
                playerOrdinal: 1,
                territoryCaptured: false
            } as TurnState)
            expect(state.events[3]).toBe(action)
        })

        it('cannot end the occupy phase', () => {
            expect(
                () => havingState(rng(1, 2, 4, 3)).update(
                    deploy(1, 'northern_europe', 9),
                    endPhase(1), // deploy
                    attack(1, 'northern_europe', 'great_britain', 3),
                    endPhase(1), // occupy
                )
            ).toThrow('cannot end the occupy phase')
        })

        it('cannot end a phase as another player', () => {
            expect(
                () => havingState().update(
                    endPhase(2),
                )
            ).toThrow('it is not player 2\'s turn')
        })

        it('advances to next turn', () => {
            const state = havingState().update(
                endPhase(1), // deploy
                endPhase(1), // attack
                endPhase(1) // fortify
            ).toState()

            expect(state.turn).toStrictEqual({
                phase: 'deploy',
                playerOrdinal: 2,
                selected: null,
                armiesRemaining: 7
            } as TurnState)
            expect(state.turnNumber).toBe(2)
        })
    })

    describe('deployment', () => {
        it('can deploy armies to an occupied territory', () => {
            const action = deploy(1, 'alaska', 9)
            const state = havingState().update(action).toState()

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
                () => havingState().update(
                    deploy(2, 'alaska', 1)
                )
            ).toThrow('it is not player 2\'s turn')
        })

        it('cannot deploy in the attack phase', () => {
            expect(
                () => havingState().update(
                    endPhase(1), // deploy
                    deploy(1, 'alaska', 1)
                )
            ).toThrow('not in the deploy phase')
        })

        it('cannot deploy in the fortify phase', () => {
            expect(
                () => havingState().update(
                    endPhase(1), // deploy
                    endPhase(1), // attack
                    deploy(1, 'alaska', 1)
                )
            ).toThrow('not in the deploy phase')
        })

        it('cannot deploy 0 armies', () => {
            expect(() => havingState().update(deploy(1, 'alaska', 0)))
                .toThrow('must deploy at least one army')
        })

        it('cannot deploy too many armies', () => {
            expect(() => havingState().update(deploy(1, 'alaska', 10)))
                .toThrow('cannot deploy 10 armies as only have 9 remaining')
        })

        it('cannot deploy to an unoccupied territory', () => {
            expect(() => havingState().update(deploy(1, 'central_america', 1)))
                .toThrow('central_america is not occupied')
        })
    })

    describe('attack', () => {

        it('attacks and occupies with reserve armies', () => {
            const state = havingState(rng(1, 2, 4, 3)).update(
                deploy(1, 'northern_europe', 9),
                endPhase(1), // deploy
                attack(1, 'northern_europe', 'great_britain', 3)
            ).toState()

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
            const state = havingState(rng(4, 3)).update(
                endPhase(1), // deploy
                attack(1, 'northern_europe', 'great_britain', 1)
            ).toState()

            expect(state.turn).toStrictEqual({
                phase: 'attack',
                playerOrdinal: 1,
                territoryCaptured: true
            } as TurnState)

            expectTerritory(state, 'northern_europe', 1, 1)
            expectTerritory(state, 'great_britain', 1, 1)
        })

        it('attacks without any occupation', () => {
            const state = havingState(rng(1, 2, 4, 4, 1)).update(
                deploy(1, 'northern_europe', 9),
                endPhase(1), // deploy
                attack(1, 'northern_europe', 'scandinavia', 3)
            ).toState()

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
                () => havingState(rng(1, 2, 4, 4, 1)).update(
                    endPhase(1), // deploy
                    attack(2, 'northern_europe', 'scandinavia', 3)
                )
            ).toThrow('it is not player 2\'s turn')
        })

        it('cannot attack in the deploy phase', () => {
            expect(
                () => havingState(rng(1, 2, 4, 4, 1)).update(
                    attack(1, 'northern_europe', 'scandinavia', 3)
                )
            ).toThrow('not in the attack phase')
        })

        it('cannot attack in the fortify phase', () => {
            expect(
                () => havingState(rng(1, 2, 4, 4, 1)).update(
                    endPhase(1), // deploy
                    endPhase(1), // attack
                    attack(1, 'northern_europe', 'scandinavia', 3)
                )
            ).toThrow('not in the attack phase')
        })

        it('cannot attack from an unoccupied territory', () => {
            expect(
                () => havingState(rng(1, 2, 4, 4, 1)).update(
                    endPhase(1), // deploy
                    attack(1, 'scandinavia', 'great_britain', 3)
                )
            ).toThrow('cannot attack from scandinavia as it is not occupied')
        })

        it('cannot attack a territory that is already occupied', () => {
            expect(
                () => havingState(rng(1, 2, 4, 4, 1)).update(
                    endPhase(1), // deploy
                    attack(1, 'alaska', 'yakutsk', 3)
                )
            ).toThrow('cannot attack yakutsk as it is already occupied')
        })

        it('cannot attack with more armies than are available', () => {
            expect(
                () => havingState(rng(1, 2, 4, 1)).update(
                    endPhase(1), // deploy
                    attack(1, 'new_guinea', 'eastern_australia', 2)
                )
            ).toThrow('cannot attack with 2 armies from new_guinea as only 2 armies are deployed')
        })

        it('cannot attack a territory that does not share a border', () => {
            expect(
                () => havingState(rng(4, 3, 6)).update(
                    endPhase(1), // deploy
                    attack(1, 'northern_europe', 'eastern_australia', 1)
                )
            ).toThrow('cannot attack from northern_europe to eastern_australia as they do not share a border')
        })

        it('cannot attack same territory', () => {
            expect(
                () => havingState(rng(4, 3, 6)).update(
                    endPhase(1), // deploy
                    attack(1, 'northern_europe', 'northern_europe', 1)
                )
            ).toThrow('cannot attack northern_europe as it is already occupied')
        })
    })

    describe('occupy', () => {
        it('moves armies into an occupied territory', () => {
            const state = havingState(rng(1, 2, 4, 3)).update(
                deploy(1, 'northern_europe', 9),
                endPhase(1), // deploy
                attack(1, 'northern_europe', 'great_britain', 3),
                occupy(1, 10),
            ).toState()

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
                () => havingState().update(
                    occupy(1, 10),
                )
            ).toThrow('not in the occupy phase')
        })

        it('cannot occupy in the attack phase', () => {
            expect(
                () => havingState().update(
                    endPhase(1), // deploy
                    occupy(1, 10),
                )
            ).toThrow('not in the occupy phase')
        })

        it('cannot occupy in the fortify phase', () => {
            expect(
                () => havingState().update(
                    endPhase(1), // deploy
                    endPhase(1), // attack
                    occupy(1, 10),
                )
            ).toThrow('not in the occupy phase')
        })

        it('cannot move less than the minimum available armies', () => {
            expect(
                () => havingState(rng(1, 2, 4, 3)).update(
                    deploy(1, 'northern_europe', 9),
                    endPhase(1), // deploy
                    attack(1, 'northern_europe', 'great_britain', 3),
                    occupy(1, 2),
                )
            ).toThrow('must move at least 3 armies')
        })

        it('cannot move more than the maximum available armies', () => {
            expect(
                () => havingState(rng(1, 2, 4, 3)).update(
                    deploy(1, 'northern_europe', 9),
                    endPhase(1), // deploy
                    attack(1, 'northern_europe', 'great_britain', 3),
                    occupy(1, 11),
                )
            ).toThrow('cannot move more than 10 armies')
        })
    })

    describe('fortify', () => {
        it('moves armies between occupied territories', () => {
            const state = havingState().update(
                deploy(1, 'argentina', 9),
                endPhase(1), // deploy
                endPhase(1), // attack
                fortify(1, 'argentina', 'venezuela', 9)
            ).toState()

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
                () => havingState().update(
                    deploy(1, 'argentina', 9),
                    endPhase(1), // deploy
                    endPhase(1), // attack
                    fortify(1, 'argentina', 'argentina', 9)
                )
            ).toThrow('cannot move armies back to the same territory')
        })

        it('cannot move armies from an unoccupied territory', () => {
            expect(
                () => havingState().update(
                    endPhase(1), // deploy
                    endPhase(1), // attack
                    fortify(1, 'great_britain', 'northern_europe', 9)
                )
            ).toThrow('annot move armies from great_britain as it is not occupied')
        })

        it('cannot move armies to an unoccupied territory', () => {
            expect(
                () => havingState().update(
                    endPhase(1), // deploy
                    endPhase(1), // attack
                    fortify(1, 'northern_europe', 'great_britain', 9)
                )
            ).toThrow('annot move armies to great_britain as it is not occupied')
        })

        it('cannot move more than the maximum available armies', () => {
            expect(
                () => havingState().update(
                    deploy(1, 'argentina', 9),
                    endPhase(1), // deploy
                    endPhase(1), // attack
                    fortify(1, 'argentina', 'venezuela', 10)
                )
            ).toThrow('cannot move 10 armies from argentina as only 10 armies are deployed')
        })

        it('cannot move where no route is available', () => {
            expect(
                () => havingState().update(
                    deploy(1, 'argentina', 9),
                    endPhase(1), // deploy
                    endPhase(1), // attack
                    fortify(1, 'argentina', 'northern_europe', 9)
                )
            ).toThrow('cannot move armies from argentina to northern_europe as there is no available route')
        })
    })


    describe('cards', () => {
        it('draws a card when territory occupied', () => {
            const state = havingState(rng(1, 2, 4, 3)).update(
                deploy(1, 'northern_europe', 9),
                endPhase(1), // deploy
                attack(1, 'northern_europe', 'great_britain', 3),
                occupy(1, 10),
                endPhase(1) // attack
            ).toState()

            expect(state.turn).toStrictEqual({
                phase: 'fortify',
                playerOrdinal: 1,
            } as TurnState)

            expect(state.players[0].cards).toStrictEqual(['egypt'])
            expect(state.cards).toHaveLength(43)
        })

        it('does not draw a card when no territory occupied', () => {
            const state = havingState(rng(1, 2, 4, 6)).update(
                deploy(1, 'northern_europe', 9),
                endPhase(1), // deploy
                attack(1, 'northern_europe', 'great_britain', 3),
                endPhase(1) // attack
            ).toState()

            expect(state.turn).toStrictEqual({
                phase: 'fortify',
                playerOrdinal: 1,
            } as TurnState)

            expect(state.players[0].cards).toHaveLength(0)
            expect(state.cards).toHaveLength(44)
        })

        function havingCards(card1: CardName, card2: CardName, card3: CardName) {
            const state = havingState().toState()
            state.players[0].cards.push(card1, card2, card3)
            return ServerGame.fromState(state, rng())
                .update(turnInCards(1, [card1, card2, card3]))
                .toState()
        }

        it('can turn in a set of infantry cards', () => {
            const state = havingCards('new_guinea', 'alaska', 'venezuela')
            expect(state.turn).toStrictEqual({
                phase: 'deploy',
                playerOrdinal: 1,
                armiesRemaining: 9 + 4,
                selected: null
            } as TurnState)
            expectTerritory(state, 'new_guinea', 1, 2 + 2)
            expectTerritory(state, 'alaska', 1, 4)
            expectTerritory(state, 'venezuela', 1, 2)
        })

        it('can turn in a set of cavalry cards', () => {
            const state = havingCards('madagascar', 'north_africa', 'greenland')
            expect(state.turn).toStrictEqual({
                phase: 'deploy',
                playerOrdinal: 1,
                armiesRemaining: 9 + 6,
                selected: null
            } as TurnState)
            expectTerritory(state, 'madagascar', 1, 1 + 2)
        })

        it('can turn in a set of artillery cards', () => {
            const state = havingCards('great_britain', 'japan', 'southern_europe')
            expect(state.turn).toStrictEqual({
                phase: 'deploy',
                playerOrdinal: 1,
                armiesRemaining: 9 + 8,
                selected: null
            } as TurnState)
            expectTerritory(state, 'japan', 1, 2 + 2)
        })

        it('can turn in a set of each card', () => {
            const state = havingCards('great_britain', 'north_africa', 'east_africa')
            expect(state.turn).toStrictEqual({
                phase: 'deploy',
                playerOrdinal: 1,
                armiesRemaining: 9 + 10,
                selected: null
            } as TurnState)
            expectTerritory(state, 'great_britain', 2, 1)
            expectTerritory(state, 'north_africa', 2, 2)
            expectTerritory(state, 'east_africa', 2, 1)
        })

        it('can turn in a set of each card with a wild', () => {
            const state = havingCards('great_britain', 'north_africa', 'wild1')
            expect(state.turn).toStrictEqual({
                phase: 'deploy',
                playerOrdinal: 1,
                armiesRemaining: 9 + 10,
                selected: null
            } as TurnState)
        })

        it('can turn in a set of artillery cards with a wild', () => {
            const state = havingCards('great_britain', 'wild2', 'southern_europe')
            expect(state.turn).toStrictEqual({
                phase: 'deploy',
                playerOrdinal: 1,
                armiesRemaining: 9 + 8,
                selected: null
            } as TurnState)
        })

        it('cannot turn in a card that is not held', () => {
            const state = havingState().toState()

            const cards: [CardName, CardName, CardName] = ['new_guinea', 'alaska', 'venezuela']
            state.players[0].cards.push('new_guinea', 'alaska')

            const game = ServerGame.fromState(state, rng())
            expect(
                () => game.update(turnInCards(1, cards))
            ).toThrow('does not hold the venezuela card')
        })

        it('cannot turn in an invalid hand', () => {
            expect(
                () => havingCards('great_britain', 'north_africa', 'southern_europe')
            ).toThrow('must turn in three of the same or one of each card')
        })

        it('cannot turn in two cards', () => {
            const state = havingState().toState()
            state.players[0].cards.push('new_guinea', 'alaska')
            const game = ServerGame.fromState(state, rng())
            expect(
                () => game.update(turnInCards(1, ['new_guinea', 'alaska'] as any))
            ).toThrow('ust turn in exactly three cards')
        })
    })
})