import {
    Prisma,
    PrismaClient,
    GamePlayer as DbPlayer,
    GameAction as DbAction,
    DeployAction as DbDeployAction,
    AttackAction as DbAttackAction,
    OccupyAction as DbOccupyAction,
    FortifyAction as DbFortifyAction,
    TurnInCardsAction as DbTurnInCardsAction,
} from "@prisma/client";
import {
    Action,
    Event,
    EndPhaseAction,
    ActionType,
    ActionBase,
    TerritoryName,
    DeployAction,
    AttackAction,
    DiceRoll,
    FortifyAction,
    CardName,
    TurnInCardsAction, OccupyAction, Player, GameState
} from "@/game";
import {newGameState} from "@/game/state";

const prisma = new PrismaClient()

class GameDB {
    async create(seed: number, players: Player[], actions: Action[]): Promise<{ id: number }> {
        const { id } = await prisma.game.create({
            data: {
                seed,
                dateStarted: new Date(),
                dateUpdated: new Date(),
                players: {
                    create: players.map(p => ({
                        username: p.username,
                        displayName: p.displayName,
                        ordinal: p.ordinal,
                    }))
                },
                actions: {
                    create: actions.map(toDbAction)
                }
            }
        })
        return { id }
    }

    async update(id: number, ordinal: number, action: Action) {
        await prisma.gameAction.create({
            data: {
                ...toDbAction(action, ordinal),
                game: {
                    connect: { id }
                }
            }
        })
    }

    async getByPlayer(id: number, username: string): Promise<GameState | null> {
        const dbGame = await prisma.game.findFirst({
            where: { id, players: { some: { username } } },
            include: {
                actions: {
                    include: {
                        deploy: true,
                        attack: true,
                        occupy: true,
                        fortify: true,
                        turnInCards: true,
                    }
                },
                players: true
            }
        })

        if (!dbGame) {
            return null
        }

        const actions: Action[] = dbGame.actions
            .sort((a, b) => a.ordinal - b.ordinal)
            .map(toAction)

        const players = dbGame.players.map(p => ({
            username: p.username,
            displayName: p.displayName,
            ordinal: p.ordinal,
            cards: []
        } as Player))

        return newGameState(
            dbGame.id,
            dbGame.seed,
            players,
            actions,
            dbGame.dateStarted,
        )
    }
}

interface KitchenSinkDbAction extends DbAction {
    deploy: DbDeployAction | null
    attack: DbAttackAction | null
    occupy: DbOccupyAction | null
    fortify: DbFortifyAction | null
    turnInCards: DbTurnInCardsAction | null
}


type NewDbAction = Prisma.GameActionCreateWithoutGameInput

function toDbAction(action: Action, ordinal: number): NewDbAction {
    const result: NewDbAction = {
        type: action.type,
        playerOrdinal: action.playerOrdinal,
        date: action.date,
        ordinal,
    }
    switch (action.type) {
        case "end_phase":
            // no detail object to create
            break;

        case "deploy":
            result.deploy = {
                create: {
                    armies: action.armies,
                    territory: action.territory,
                }
            }
            break;

        case "attack":
            result.attack = {
                create: {
                    territoryFrom: action.territoryFrom,
                    territoryTo: action.territoryTo,
                    attackingDiceRoll: serializeDiceRoll(action.attackingDiceRoll),
                    defendingDiceRoll: serializeDiceRoll(action.defendingDiceRoll)
                }
            }
            break;

        case "occupy":
            result.occupy = {
                create: {
                    armies: action.armies
                }
            }
            break;

        case "fortify":
            result.fortify = {
                create: {
                    armies: action.armies,
                    territoryFrom: action.territoryFrom,
                    territoryTo: action.territoryTo
                }
            }
            break;

        case "turn_in_cards":
            result.turnInCards = {
                create: {
                    card1: action.cards[0],
                    card2: action.cards[1],
                    card3: action.cards[2],
                }
            }
            break;

        default:
            throw new Error(`unknown action type`)
    }
    return result
}

function toAction(action: KitchenSinkDbAction): Action {
    const base: ActionBase = {
        type: action.type as ActionType,
        playerOrdinal: action.playerOrdinal,
        date: action.date,
    }
    switch (base.type) {
        case 'end_phase':
            return base as EndPhaseAction
        case "deploy":
            if (!action.deploy) {
                throw new Error(`action ${action.id} is of type deploy but has no deploy action attached`)
            }
            return {
                ...base,
                territory: action.deploy.territory as TerritoryName,
                armies: action.deploy.armies,
            } as DeployAction
        case "attack":
            if (!action.attack) {
                throw new Error(`action ${action.id} is of type attack but has no attack action attached`)
            }
            return {
                ...base,
                territoryFrom: action.attack.territoryFrom as TerritoryName,
                territoryTo: action.attack.territoryTo as TerritoryName,
                attackingDiceRoll: deserializeDiceRoll(action.attack.attackingDiceRoll),
                defendingDiceRoll: deserializeDiceRoll(action.attack.defendingDiceRoll),
            } as AttackAction
        case "occupy":
            if (!action.occupy) {
                throw new Error(`action ${action.id} is of type occupy but has no occupy action attached`)
            }
            return {
                ...base,
                armies: action.occupy.armies
            } as OccupyAction
        case "fortify":
            if (!action.fortify) {
                throw new Error(`action ${action.id} is of type fortify but has no fortify action attached`)
            }
            return {
                ...base,
                territoryFrom: action.fortify.territoryFrom as TerritoryName,
                territoryTo: action.fortify.territoryTo as TerritoryName,
                armies: action.fortify.armies,
            } as FortifyAction
        case 'turn_in_cards':
            if (!action.turnInCards) {
                throw new Error(`action ${action.id} is of type turnInCards but has no turnInCards action attached`)
            }
            return {
                ...base,
                cards: [action.turnInCards.card1, action.turnInCards.card2, action.turnInCards.card3] as [CardName, CardName, CardName],
            } as TurnInCardsAction
    }
}

function deserializeDiceRoll(s: string): DiceRoll[] {
    return s.split(',').map(n => parseInt(n, 10) as DiceRoll)
}

function serializeDiceRoll(diceRoll: DiceRoll[]): string {
    return diceRoll.join(',')
}