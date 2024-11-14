import {META} from "@/game/meta";

describe('meta', () => {
    it('has all territory meta', () => {
        const keys = new Set(Object.keys(META))
        expect(keys.size).toBe(42)
    })
})