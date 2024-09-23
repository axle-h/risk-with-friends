import {GameState, GameSummary, Player} from "@/game";
import {NextRequest} from "next/server";
import {NewGame, Schema, UpdateGame} from "@/game/schema";
import {Game, newGame} from "@/game/game";
import rng from '@/game/rng'
import { PrismaClient, Game as DbGame} from "@prisma/client";



export interface Data {
    getByPlayer(id: number, username: string): Promise<GameState | null>

    getAllByPlayer(username: string): Promise<GameState[]>

    create(game: Omit<GameState, 'id'>): Promise<GameState>

    update(id: number, game: GameState): Promise<GameState | null>
}

export interface User {
    username: string,
    displayName: string
}

export class GameService {
    constructor(
        private readonly data: Data,
        private readonly user: User
    ) {}

    async getGames(): Promise<GameSummary[]> {
        const games = await this.data.getAllByPlayer(this.user.username)
        return games.map(({ id, turnNumber, dateStarted, dateUpdated, players }) => ({
            id,
            dateStarted,
            dateUpdated,
            turnNumber,
            opponent: players.find(p => p.username !== this.user.username)!,
        }))
    }

    async createGame(request: NewGame): Promise<GameState> {
        const { opponent } = Schema.NewGame.parse(request)
        const players: Player[] = [
            { ordinal: 1, username: this.user.username, displayName: this.user.displayName },
            { ordinal: 2, username: opponent, displayName: 'Kathryn Haslehurst' }, // TODO get from SSO
        ]
        const game = newGame(rng, players)
        return await this.data.create(game)
    }

    async getGame(id: number): Promise<GameState | null> {
        return await this.data.getByPlayer(id, this.user.username)
    }

    async updateGame(id: number, update: UpdateGame): Promise<GameState | null> {
        const state = await this.data.getByPlayer(id, this.user.username)
        if (!state) {
            return null
        }
        const playerOrdinal = state.players.find(p => p.username === this.user.username)?.ordinal
        if (!playerOrdinal) {
            return null
        }

        const gameOrError = new Game(playerOrdinal, state).update(update)
        if (typeof gameOrError === 'string') {
            throw new Error(gameOrError)
        }

        return await this.data.update(id, gameOrError.gameState)
    }
}

export class InMemoryData implements Data {
    private static readonly GAMES: GameState[] = []

    getByPlayer(id: number, username: string): Promise<GameState | null> {
        const game = InMemoryData.GAMES
            .find(g => g.id === id && g.players.some(p => p.username === username))
        return Promise.resolve(game || null)

    }
    getAllByPlayer(username: string): Promise<GameState[]> {
        const games = InMemoryData.GAMES.filter(g => g.players.some(p => p.username === username))
        return Promise.resolve(games)
    }

    create(game: Omit<GameState, "id">): Promise<GameState> {
        const newGame = {
            id: InMemoryData.GAMES.length + 1,
            ...game
        }
        InMemoryData.GAMES.push(newGame)
        return Promise.resolve(newGame)
    }

    update(id: number, game: GameState): Promise<GameState | null> {
        const existing = InMemoryData.GAMES.find(g => g.id === id)
        if (!existing) {
            return Promise.resolve(null)
        }
        Object.assign(existing, game)
        return Promise.resolve(existing)
    }
}

export async function db(request: NextRequest): Promise<GameService> {
    // const session = await getSession({ request }) TODO
    const user = { username: 'alex', displayName: 'Alex Haslehurst' }
    const data = new InMemoryData()
    return new GameService(data, user)
}
