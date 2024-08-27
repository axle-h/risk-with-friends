import {z} from "zod";

export class Schema {
    static readonly NewGame = z.object({
        opponent: z.string()
    })
}

export type NewGame = z.infer<(typeof Schema)['NewGame']>