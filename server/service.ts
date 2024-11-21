import {GameState, GameSummary, NewAction, newActionToAction, NewPlayer} from "@/game";
import {NewGame, Schema} from "@/game/schema";
import {db, Db} from "@/server/db";
import {Game} from "@/game/game";
import {PureGameRng} from "@/game/rng";
import {auth} from "@/auth";
import {NextRequest} from "next/server";
import {Session} from "next-auth";

export interface User {
    username: string,
    displayName: string
}

export class GameService {
    constructor(
        private readonly db: Db,
        private readonly user: User
    ) {}

    async getGames(): Promise<GameSummary[]> {
        return await this.db.listByUsername(this.user.username)
    }

    async createGame(request: NewGame): Promise<GameState> {
        const { opponent } = Schema.NewGame.parse(request)
        const players: NewPlayer[] = [
            { ordinal: 1, username: this.user.username, displayName: this.user.displayName },
            { ordinal: 2, username: opponent, displayName: 'Kathryn Haslehurst' }, // TODO get from SSO
        ]

        const seed = PureGameRng.seed()
        const rng = PureGameRng.fromSeed(seed)
        const state = Game.new(0, players, rng).toState()
        const { id } = await this.db.create(seed, state)
        state.id = id
        return state
    }

    async getGame(id: number): Promise<GameState | null> {
        const game = await this.db.getByUsername(id, this.user.username)
        return game?.toState() || null
    }

    async updateGame(id: number, newActionRequest: NewAction): Promise<GameState | null> {
        const newAction = Schema.Action.parse(newActionRequest)

        const game = await this.db.getByUsername(id, this.user.username)
        if (!game) {
            return null
        }

        const { players } = game.toState()
        const playerOrdinal = players.find(p => p.username === this.user.username)?.ordinal
        if (!playerOrdinal) {
            return null
        }

        const action = newActionToAction(newAction, playerOrdinal)

        const ordinal = game.currentVersion
        game.update(action)

        await this.db.update(id, ordinal, action)

        return game.toState()
    }
}

export async function gameService(): Promise<GameService | null> {
    const user = await authenticatedUser();
    if (!user) return null
    return new GameService(db, user)
}

async function authenticatedUser(): Promise<User | null> {
    const session = await auth()
    if (!session || !session.user) {
        return null
    }
    const { user } = session
    if (!user.name) {
        return null
    }
    const names = []
    if ('given_name' in user) {
        names.push(user.given_name)
    }
    if ('family_name' in user) {
        names.push(user.family_name)
    }
    return { username: user.name, displayName: names.length === 0 ? user.name : names.join(' ') }
}
