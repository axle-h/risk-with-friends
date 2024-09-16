import {z} from "zod"

export class Schema {
    static readonly TerritoryName = z.enum([
        'afghanistan', 'alaska', 'alberta', 'argentina', 'brazil', 'central_america', 'china', 'congo', 'east_africa',
        'eastern_australia', 'eastern_united_states', 'egypt', 'great_britain', 'greenland', 'iceland', 'india',
        'indonesia', 'irkutsk', 'japan', 'kamchatka', 'madagascar', 'middle_east', 'mongolia', 'new_guinea',
        'north_africa', 'northern_europe', 'northwest_territory', 'ontario', 'peru', 'quebec', 'scandinavia', 'siam',
        'siberia', 'south_africa', 'southern_europe', 'ukraine', 'ural', 'venezuela', 'western_australia',
        'western_europe', 'western_united_states', 'yakursk'
    ])
    static readonly ContinentName = z.enum([
        'africa', 'asia', 'europe', 'north_america', 'oceana', 'south_america'
    ])

    static readonly NewGame = z.object({
        opponent: z.string()
    })

    static readonly DeployAction = z.object({
        type: z.literal('deploy'),
        territory: this.TerritoryName,
        armies: z.number().min(1)
    })

    static readonly AttackAction = z.object({
        type: z.literal('attack'),
        territory: this.TerritoryName,
        target: this.TerritoryName,
        armies: z.number().min(1).max(3)
    })

    static readonly FortifyAction = z.object({
        type: z.literal('fortify'),
        territory: this.TerritoryName,
        target: this.TerritoryName,
        armies: z.number().min(1).max(3)
    })

    static readonly UpdateGame = z.discriminatedUnion('type', [
        this.DeployAction,
        this.AttackAction,
        this.FortifyAction
    ])
}

export type NewGame = z.infer<(typeof Schema)['NewGame']>

export type TerritoryName = z.infer<(typeof Schema)['TerritoryName']>
export type ContinentName = z.infer<(typeof Schema)['ContinentName']>

export type DeployAction = z.infer<(typeof Schema)['DeployAction']>
export type AttackAction = z.infer<(typeof Schema)['AttackAction']>
export type FortifyAction = z.infer<(typeof Schema)['FortifyAction']>
export type UpdateGame = z.infer<(typeof Schema)['UpdateGame']>
