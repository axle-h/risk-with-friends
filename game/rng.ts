import { xoroshiro128plus, RandomGenerator, unsafeUniformIntDistribution } from 'pure-rand'
import {DiceRoll, TerritoryStateMap} from "@/game/types";

export interface GameRng {
    /**
     * Shuffles an array in-place
     */
    shuffle<T>(array: T[]): void

    /**
     * Picks a random element from the array
     */
    pick<T>(array: T[]): T

    diceRoll(n: number): DiceRoll[]

    state(): readonly number[]
}

export class PureGameRng implements GameRng {
    constructor(private readonly rng: RandomGenerator) {}

    static fromSeed(seed: number) {
        const rng = xoroshiro128plus(seed || (Date.now() ^ (Math.random() * 0x100000000)))
        return new PureGameRng(rng)
    }

    static fromState(state: readonly number[]) {
        const rng = xoroshiro128plus.fromState(state)
        return new PureGameRng(rng)
    }

    int(max: number = Number.MAX_SAFE_INTEGER): number {
        return unsafeUniformIntDistribution(0, max - 1, this.rng)
    }

    shuffle<T>(array: T[]): void {
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

    pick<T>(array: T[]): T {
        return array[this.int(array.length)]
    }

    state(): readonly number[] {
        if (this.rng.getState) {
            return this.rng.getState()
        }
        throw new Error('no state available for this algorithm')
    }
}

export class SequenceRng implements GameRng {
    constructor(private readonly results: DiceRoll[]) {}


    shuffle<T>(array: T[]): void {
        throw new Error('Method not implemented.');
    }

    pick<T>(array: T[]): T {
        throw new Error('Method not implemented.');
    }

    diceRoll(n: number): DiceRoll[] {
        const result: DiceRoll[] = []
        for (let i = 0; i < n; i++) {
            result.push(this.results.shift() as DiceRoll)
        }
        return result
    }

    state(): readonly number[] {
        throw new Error('Method not implemented.');
    }
}