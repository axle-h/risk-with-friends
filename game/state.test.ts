import {newGameState} from "@/game/state";
import {Action, GameState, Player, TurnPhase, TurnState} from "@/game/types";
import {PureRandRng} from "@/game/rng";
import {draft} from "@/game/draft";
import {deploy, attack, endPhase} from "@/game/factory";

describe('game state', () => {
    const date = new Date(1)

    function havingState(...actions: Action[]) {
        const players: Player[] = [
            { ordinal: 1, username: 'alex', displayName: 'Alex Haslehurst', cards: [] },
            { ordinal: 2, username: 'someone', displayName: 'Someone Else', cards: [] }
        ]
        const territories = draft(new PureRandRng(100), players.length)
        return newGameState(1, players, territories, actions, date)
    }

    it('creates empty state', () => {
        expect(havingState()).toStrictEqual({
            id: 1,
            players: [
                { ordinal: 1, username: 'alex', displayName: 'Alex Haslehurst', cards: [] },
                { ordinal: 2, username: 'someone', displayName: 'Someone Else', cards: [] }
            ],
            turnNumber: 1,
            territories: draft(new PureRandRng(100), 2),
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
        it('applies end phase', () => {
            const action = endPhase(1, 'deploy')
            const state = havingState(action)

            expect(state.turn).toStrictEqual({
                phase: 'attack',
                playerOrdinal: 1,
                territoryCaptured: false
            } as TurnState)
            expect(state.events[3]).toBe(action)
        })

        it('ends occupy phase', () => {
            const state = havingState(
                deploy(1, 'northern_europe', 9),
                endPhase(1, 'deploy'),
                attack(1, 'northern_europe', 'great_britain', [1, 2, 4], [3]),
                endPhase(1, 'occupy'),
            )

            expect(state.turn).toStrictEqual({
                phase: 'attack',
                playerOrdinal: 1,
                territoryCaptured: true
            } as TurnState)
        })

        it('rejects for incorrect player', () => {
            expect(
                () => havingState(
                    endPhase(2, 'deploy'),
                )
            ).toThrow('could not apply end_phase for player 2: not player 2\'s turn')
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

        it('rejects for incorrect phase', () => {
            expect(
                () => havingState(
                    { type: 'end_phase', date, playerOrdinal: 1, phase: 'attack' }
                )
            ).toThrow('could not apply end_phase for player 1: not in the attack phase')
        })
    })

    describe('deployment', () => {
        it('applies deployment', () => {
            const action = deploy(1, 'alaska', 9)
            const state = havingState(action)

            expect(state.turn).toStrictEqual({
                phase: 'deploy',
                playerOrdinal: 1,
                armiesRemaining: 0,
                selected: null,
            } as TurnState)
            expect(state.events[3]).toBe(action)
            expect(state.territories['alaska'].armies).toBe(4 + 9)
        })

        it('rejects for incorrect player', () => {
            expect(
                () => havingState(
                    deploy(2, 'alaska', 1)
                )
            ).toThrow('could not apply deploy for player 2: not player 2\'s turn')
        })

        it('rejects in attack phase', () => {
            expect(
                () => havingState(
                    endPhase(1, 'deploy'),
                    deploy(1, 'alaska', 1)
                )
            ).toThrow('could not apply deploy for player 1: not in the deploy phase')
        })

        it('rejects in fortify phase', () => {
            expect(
                () => havingState(
                    endPhase(1, 'deploy'),
                    endPhase(1, 'attack'),
                    deploy(1, 'alaska', 1)
                )
            ).toThrow('could not apply deploy for player 1: not in the deploy phase')
        })

        it('rejects 0 armies', () => {
            expect(() => havingState(deploy(1, 'alaska', 0)))
                .toThrow('must deploy at least one army')
        })

        it('rejects greedy', () => {
            expect(() => havingState(deploy(1, 'alaska', 10)))
                .toThrow('cannot deploy 10 armies as only have 9 remaining')
        })

        it('rejects unoccupied', () => {
            expect(() => havingState(deploy(1, 'central_america', 1)))
                .toThrow('central_america is not occupied')
        })
    })

    describe('attack', () => {

        it('applies attack and occupies with excess', () => {
            const action = attack(1, 'northern_europe', 'great_britain', [1, 2, 4], [3])
            const state = havingState(
                deploy(1, 'northern_europe', 9),
                endPhase(1, 'deploy'),
                action
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
            expect(state.events[state.events.length - 2]).toBe(action)
            expect(state.events[state.events.length - 1].type).toBe('territory_occupied')

            expect(state.territories['northern_europe'].armies).toBe(2 + 9)
            expect(state.territories['northern_europe'].owner).toBe(1)
            expect(state.territories['great_britain'].armies).toBe(0)
            expect(state.territories['great_britain'].owner).toBe(1)
        })

        it('applies attack and occupies with exact', () => {
            const state = havingState(
                endPhase(1, 'deploy'),
                attack(1, 'northern_europe', 'great_britain', [4], [3])
            )

            expect(state.turn).toStrictEqual({
                phase: 'attack',
                playerOrdinal: 1,
                territoryCaptured: true
            } as TurnState)

            expect(state.territories['northern_europe'].armies).toBe(1)
            expect(state.territories['northern_europe'].owner).toBe(1)
            expect(state.territories['great_britain'].armies).toBe(1)
            expect(state.territories['great_britain'].owner).toBe(1)
        })

        it('applies attack', () => {
            const action = attack(1, 'northern_europe', 'scandinavia', [1, 2, 4], [4, 1])
            const state = havingState(
                deploy(1, 'northern_europe', 9),
                endPhase(1, 'deploy'),
                action
            )

            expect(state.turn).toStrictEqual({
                phase: 'attack',
                playerOrdinal: 1,
                territoryCaptured: false
            } as TurnState)
            expect(state.events[state.events.length - 1]).toBe(action)

            expect(state.territories['northern_europe'].armies).toBe(2 + 9 - 1)
            expect(state.territories['northern_europe'].owner).toBe(1)
            expect(state.territories['scandinavia'].armies).toBe(4 - 1)
            expect(state.territories['scandinavia'].owner).toBe(2)
        })

        it('rejects for incorrect player', () => {
            expect(
                () => havingState(
                    endPhase(1, 'deploy'),
                    attack(2, 'northern_europe', 'scandinavia', [1, 2, 4], [4, 1])
                )
            ).toThrow('could not apply attack for player 2: not player 2\'s turn')
        })

        it('rejects in deploy phase', () => {
            expect(
                () => havingState(
                    attack(1, 'northern_europe', 'scandinavia', [1, 2, 4], [4, 1])
                )
            ).toThrow('could not apply attack for player 1: not in the attack phase')
        })

        it('rejects in fortify phase', () => {
            expect(
                () => havingState(
                    endPhase(1, 'deploy'),
                    endPhase(1, 'attack'),
                    attack(1, 'northern_europe', 'scandinavia', [1, 2, 4], [4, 1])
                )
            ).toThrow('could not apply attack for player 1: not in the attack phase')
        })

        it('rejects when source territory not occupied', () => {
            expect(
                () => havingState(
                    endPhase(1, 'deploy'),
                    attack(1, 'scandinavia', 'great_britain', [1, 2, 4], [4, 1])
                )
            ).toThrow('cannot attack from scandinavia as it is not occupied')
        })

        it('rejects when target territory is already occupied', () => {
            expect(
                () => havingState(
                    endPhase(1, 'deploy'),
                    attack(1, 'alaska', 'yakutsk', [1, 2, 4], [4, 1])
                )
            ).toThrow('cannot attack yakutsk as it is already occupied')
        })

        it('rejects when not enough attacking armies', () => {
            expect(
                () => havingState(
                    endPhase(1, 'deploy'),
                    attack(1, 'new_guinea', 'eastern_australia', [1, 2], [4, 1])
                )
            ).toThrow('cannot attack with 2 armies from new_guinea as only 2 armies are deployed')
        })

        it('rejects when not enough defending armies', () => {
            expect(
                () => havingState(
                    endPhase(1, 'deploy'),
                    attack(1, 'northern_europe', 'great_britain', [4], [3, 6])
                )
            ).toThrow('cannot defend great_britain with 2 armies as only 1 armies are deployed')
        })

        it('rejects when territories do not share a border', () => {
            expect(
                () => havingState(
                    endPhase(1, 'deploy'),
                    attack(1, 'northern_europe', 'eastern_australia', [4], [3, 6])
                )
            ).toThrow('cannot attack from northern_europe to eastern_australia as they do not share a border')
        })
    })
})