import {Action, CardName, GameState, GameSummary, NewAction, NewPlayer, Player} from "@/game";
import {NextRequest} from "next/server";
import {NewGame, Schema} from "@/game/schema";
import {db, Db} from "@/server/db";
import {ServerGame} from "@/game/state";
import {PureGameRng} from "@/game/rng";

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
        const state = ServerGame.new(0, players, rng).toState()
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

        const action = this.toAction(newAction, playerOrdinal)

        const ordinal = game.currentVersion
        game.update(action)

        await this.db.update(id, ordinal, action)

        return game.toState()
    }

    private toAction(action: NewAction, playerOrdinal: number): Action {
        const base = { playerOrdinal, date: new Date() }
        switch (action.type) {
            case "end_phase":
            case "deploy":
            case "attack":
            case "occupy":
            case "fortify":
                return { ...base, ...action }
            case "turn_in_cards":
                return { ...base, type: 'turn_in_cards', cards: action.cards as [CardName, CardName, CardName] }
        }
    }
}

export async function gameService(request: NextRequest): Promise<GameService> {
    // const session = await getSession({ request }) TODO
    const user = { username: 'alex', displayName: 'Alex Haslehurst' }
    return new GameService(db, user)
}
