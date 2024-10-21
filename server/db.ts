import {
    AttackAction as DbAttackAction,
    DeployAction as DbDeployAction,
    FortifyAction as DbFortifyAction,
    Game as DbGame,
    GameAction as DbAction,
    GamePlayer as DbPlayer,
    OccupyAction as DbOccupyAction,
    Prisma,
    PrismaClient,
    TurnInCardsAction as DbTurnInCardsAction,
} from "@prisma/client";
import {
    Action,
    ActionBase,
    ActionType,
    AttackAction,
    CardName,
    DeployAction,
    EndPhaseAction,
    FortifyAction, GameEvent, GameState,
    GameStatus,
    GameSummary,
    OccupyAction,
    Player,
    TerritoryName,
    TurnInCardsAction
} from "@/game";
import {ServerGame} from "@/game/state";
import {PureGameRng} from "@/game/rng";

const prisma = new PrismaClient()

export type NewGame = Omit<GameState, 'id'>

export interface Db {
    create(seed: number, game: NewGame): Promise<{ id: number }>;

    listByUsername(username: string): Promise<GameSummary[]>;

    update(id: number, ordinal: number, action: Action): Promise<void>;

    getByUsername(id: number, username: string): Promise<ServerGame | null>;
}

export class PrismaDb implements Db {
    async create(seed: number, game: NewGame): Promise<{ id: number }> {
        const {id} = await prisma.game.create({
            data: {
                seed,
                dateStarted: game.dateStarted,
                dateUpdated: game.dateUpdated,
                players: {
                    create: game.players.map(p => ({
                        username: p.username,
                        displayName: p.displayName,
                        ordinal: p.ordinal,
                    }))
                },
                actions: {
                    create: game.events.map(toDbAction).filter(a => a !== null)
                },
                currentPlayerOrdinal: game.turn.playerOrdinal
            }
        })
        return {id}
    }

    async listByUsername(username: string): Promise<GameSummary[]> {
        const games = await prisma.game.findMany({
            where: {
                players: {
                    some: {
                        username
                    }
                }
            },
            include: {
                players: true
            }
        })

        return games.map(game => {
            const myPlayerOrdinal = game.players.find(p => p.username === username)!.ordinal
            return ({
                id: game.id,
                dateStarted: game.dateStarted,
                dateUpdated: game.dateUpdated,
                opponents: game.players.filter(p => p.username !== username).map(toPlayer),
                status: toGameStatus(game, myPlayerOrdinal),
            });
        })
    }

    async update(id: number, ordinal: number, action: Action) {
        const create = toDbAction(action, ordinal)
        if (!create) {
            throw new Error('invalid action')
        }
        await prisma.game.update({
            data: {
                actions: {
                    create
                }
            },
            where: {id}
        })
    }

    async getByUsername(id: number, username: string): Promise<ServerGame | null> {
        const dbGame = await prisma.game.findFirst({
            where: {id, players: {some: {username}}},
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

        return ServerGame.new(
            dbGame.id,
            dbGame.players.map(toPlayer),
            PureGameRng.fromSeed(dbGame.seed),
            dbGame.dateStarted,
        ).update(...actions)
    }
}

function toGameStatus(game: DbGame, myPlayerOrdinal: number): GameStatus {
    if (game.winningPlayerOrdinal === myPlayerOrdinal) {
        return 'victory'
    } else if (game.winningPlayerOrdinal !== null) {
        return 'defeated'
    } else if (game.currentPlayerOrdinal === myPlayerOrdinal) {
        return 'your_turn'
    } else {
        return 'opponents_turn'
    }
}

function toPlayer(player: DbPlayer): Player {
    return {
        username: player.username,
        displayName: player.displayName,
        ordinal: player.ordinal,
        cards: []
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

function toDbAction(event: GameEvent, ordinal: number): NewDbAction | null {
    const result: NewDbAction = {
        type: event.type,
        playerOrdinal: event.playerOrdinal,
        date: event.date,
        ordinal,
    }
    switch (event.type) {
        case "end_phase":
            // no detail object to create
            break;

        case "deploy":
            result.deploy = {
                create: {
                    armies: event.armies,
                    territory: event.territory,
                }
            }
            break;

        case "attack":
            result.attack = {
                create: {
                    territoryFrom: event.territoryFrom,
                    territoryTo: event.territoryTo,
                    attackingDice: event.attackingDice,
                }
            }
            break;

        case "occupy":
            result.occupy = {
                create: {
                    armies: event.armies
                }
            }
            break;

        case "fortify":
            result.fortify = {
                create: {
                    armies: event.armies,
                    territoryFrom: event.territoryFrom,
                    territoryTo: event.territoryTo
                }
            }
            break;

        case "turn_in_cards":
            result.turnInCards = {
                create: {
                    card1: event.cards[0],
                    card2: event.cards[1],
                    card3: event.cards[2],
                }
            }
            break;

        default:
            return null
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
                attackingDice: action.attack.attackingDice,
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

export const db = new PrismaDb()