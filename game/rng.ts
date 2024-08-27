import { xoroshiro128plus, RandomGenerator, unsafeUniformIntDistribution } from 'pure-rand'

export interface Rng {
    int(max: number): number

    /**
     * Shuffles an array in-place
     */
    shuffle<T>(array: T[]): void

    /**
     * Picks a random element from the array
     */
    pick<T>(array: T[]): T
}

export class PureRandRng implements Rng {
    private readonly rng: RandomGenerator

    constructor(seed?: number) {
        this.rng = xoroshiro128plus(seed || (Date.now() ^ (Math.random() * 0x100000000)))
    }

    int(max: number): number {
        return unsafeUniformIntDistribution(0, max - 1, this.rng)
    }

    shuffle<T>(array: T[]): void {
        // Uses Durstenfeld shuffle, an optimized version of Fisher-Yates.
        for (let i = array.length - 1; i > 0; i--) {
            const j = this.int(i + 1);
            [array[i], array[j]] = [array[j], array[i]]
        }
    }

    pick<T>(array: T[]): T {
        return array[this.int(array.length)]
    }
}

const RNG: Rng = new PureRandRng()
export default RNG