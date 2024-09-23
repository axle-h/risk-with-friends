import {z} from "zod"

export class Schema {
    static readonly TerritoryName = z.enum([
        'afghanistan', 'alaska', 'alberta', 'argentina', 'brazil', 'central_america', 'china', 'congo', 'east_africa',
        'eastern_australia', 'eastern_united_states', 'egypt', 'great_britain', 'greenland', 'iceland', 'india',
        'indonesia', 'irkutsk', 'japan', 'kamchatka', 'madagascar', 'middle_east', 'mongolia', 'new_guinea',
        'north_africa', 'northern_europe', 'northwest_territory', 'ontario', 'peru', 'quebec', 'scandinavia', 'siam',
        'siberia', 'south_africa', 'southern_europe', 'ukraine', 'ural', 'venezuela', 'western_australia',
        'western_europe', 'western_united_states', 'yakutsk'
    ])
    static readonly ContinentName = z.enum([
        'africa', 'asia', 'europe', 'north_america', 'oceana', 'south_america'
    ])
    static readonly CardName = z.enum([
        ...this.TerritoryName.options,
        'wild1',
        'wild2'
    ])
    static readonly PhaseName = z.enum(['deploy', 'attack', 'fortify'])

    static readonly NewGame = z.object({
        opponent: z.string()
    })

    static readonly Deploy = z.object({
        type: z.literal('deploy'),
        territory: this.TerritoryName,
        armies: z.number().min(1)
    })

    static readonly Attack = z.object({
        type: z.literal('attack'),
        territoryFrom: this.TerritoryName,
        territoryTo: this.TerritoryName,
        armies: z.number().min(1).max(3)
    })

    static readonly Occupy = z.object({
        type: z.literal('occupy'),
        territoryFrom: this.TerritoryName,
        territoryTo: this.TerritoryName,
        armies: z.number().min(1).max(3)
    })

    static readonly Fortify = z.object({
        type: z.literal('fortify'),
        territoryFrom: this.TerritoryName,
        territoryTo: this.TerritoryName,
        armies: z.number().min(1)
    })

    static readonly EndPhase = z.object({
        type: z.literal('end_phase'),
        phase: this.PhaseName,
    })

    static readonly DrawCard = z.object({
        type: z.literal('draw_card'),
        card: this.CardName,
    })

    static readonly TurnInCards = z.object({
        type: z.literal('turn_in_cards'),
        cards: z.array(this.CardName).length(3)
    })

    static readonly Action = z.discriminatedUnion('type', [
        this.Deploy,
        this.Attack,
        this.Occupy,
        this.Fortify,
        this.EndPhase,
        this.DrawCard,
        this.TurnInCards,
    ])
}

export type NewGame = z.infer<(typeof Schema)['NewGame']>

export type TerritoryName = z.infer<(typeof Schema)['TerritoryName']>
export type ContinentName = z.infer<(typeof Schema)['ContinentName']>
export type CardName = z.infer<(typeof Schema)['CardName']>

export type NewAction = z.infer<(typeof Schema)['Action']>
export type ActionType = NewAction['type']
