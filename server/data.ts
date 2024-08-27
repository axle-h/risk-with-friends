import {GameState, GameSummary, Player} from "@/game";
import {NextRequest} from "next/server";
import {NewGame, Schema} from "@/state";
import {newGame} from "@/game/game";
import rng from '@/game/rng'

export interface Data {
    getGames(): Promise<GameSummary[]>

    createGame(request: NewGame): Promise<GameState>

    getGame(id: number): Promise<GameState | null>
}

export class InMemoryData implements Data {
    private static readonly GAMES: GameState[] = []

    constructor(
        private readonly username: string,
        private readonly displayName: string
    ) {}

    createGame(request: NewGame): Promise<GameState> {
        const { opponent } = Schema.NewGame.parse(request)
        const players: Player[] = [
            { id: 1, username: this.username, displayName: this.displayName },
            { id: 2, username: opponent, displayName: 'Kathryn Haslehurst' }, // TODO get from SSO
        ]
        const game: GameState = {
            id: InMemoryData.GAMES.length + 1,
            ...newGame(rng, players)
        }
        InMemoryData.GAMES.push(game)
        return Promise.resolve(game)
    }

    getGames(): Promise<GameSummary[]> {
        return Promise.resolve(
            InMemoryData.GAMES
                .filter(g => g.players.some(p => p.username === this.username))
                .map(({ id, turnNumber, dateStarted, dateUpdated, players }) => ({
                    id,
                    dateStarted,
                    dateUpdated,
                    turnNumber,
                    opponent: players.find(p => p.username !== this.username)!,
                }))
        )
    }

    getGame(id: number): Promise<GameState | null> {
        const game = InMemoryData.GAMES
            .find(g => g.id === id && g.players.some(p => p.username === this.username))
        return Promise.resolve(game || null)
    }
}

export async function db(request: NextRequest): Promise<Data> {
    // const session = await getSession({ request }) TODO
    return new InMemoryData('alex', 'Alex Haslehurst')
}
