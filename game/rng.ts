import { xoroshiro128plus, RandomGenerator, unsafeUniformIntDistribution } from 'pure-rand'
import {DiceRoll, TerritoryStateMap} from "@/game/types";
import {CardName, Schema, TerritoryName} from "@/game/schema";
import {newTerritories, startingArmies} from "@/game/draft";

export type RngState = readonly number[]

export interface GameRng {
    shuffleCards(): CardName[]

    draft(players: number): TerritoryStateMap

    diceRoll(n: number): DiceRoll[]

    state(): RngState
}

export class PureGameRng implements GameRng {
    constructor(private readonly rng: RandomGenerator) {}

    static fromSeed(seed: number) {
        const rng = xoroshiro128plus(seed || (Date.now() ^ (Math.random() * 0x100000000)))
        return new PureGameRng(rng)
    }

    static fromState(state: RngState) {
        const rng = xoroshiro128plus.fromState(state)
        return new PureGameRng(rng)
    }

    private int(max: number = Number.MAX_SAFE_INTEGER): number {
        return unsafeUniformIntDistribution(0, max - 1, this.rng)
    }

    shuffleCards(): CardName[] {
        const cards = [...Schema.CardName.options]
        this.shuffle(cards)
        return cards
    }

    draft(playerCount: number): TerritoryStateMap {
        const territories = newTerritories()
        const playerArmies = new Array<number>(playerCount).fill(startingArmies(playerCount))
        const territoryNames = Object.keys(territories) as TerritoryName[]
        this.shuffle(territoryNames)

        // occupy random territories
        let playerIndex = 0
        for (let territoryName of territoryNames) {
            territories[territoryName] = { owner: playerIndex + 1, armies: 1 }
            playerArmies[playerIndex] -= 1
            playerIndex = (playerIndex + 1) % playerCount
        }

        // spread remaining armies over occupied territories
        for (let playerIndex = 0; playerIndex < playerCount; playerIndex++) {
            const playerOrdinal = playerIndex + 1
            const playerTerritories = Object.values(territories)
                .filter(t => t.owner === playerOrdinal)
            for (let armyId = 0; armyId < playerArmies[playerIndex]; armyId++) {
                this.pick(playerTerritories).armies++
            }
        }

        return territories
    }

    private shuffle<T>(array: T[]): void {
        // Uses Durstenfeld shuffle, an optimized version of Fisher-Yates.
        for (let i = array.length - 1; i > 0; i--) {
            const j = this.int(i + 1);
            [array[i], array[j]] = [array[j], array[i]]
        }
    }

    diceRoll(n: number): DiceRoll[] {
        return Array(n)
            .fill(0)
            .map(_ => unsafeUniformIntDistribution(1, 6, this.rng) as DiceRoll)
    }

    private pick<T>(array: T[]): T {
        return array[this.int(array.length)]
    }

    state(): RngState {
        if (this.rng.getState) {
            return this.rng.getState()
        }
        throw new Error('no state available for this algorithm')
    }
}

export class FixedRng implements GameRng {
    constructor(
        private readonly shuffledCards: CardName[],
        private readonly diceRolls: DiceRoll[],
        private readonly fixedDraft: TerritoryStateMap
    ) {}

    shuffleCards(): CardName[] {
        return this.shuffledCards
    }

    draft(players: number): TerritoryStateMap {
        return this.fixedDraft
    }

    diceRoll(n: number): DiceRoll[] {
        const result: DiceRoll[] = []
        for (let i = 0; i < n; i++) {
            result.push(this.diceRolls.shift() as DiceRoll)
        }
        return result
    }

    state(): RngState {
        return []
    }
}