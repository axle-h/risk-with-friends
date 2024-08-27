import useSWR, {useSWRConfig, Cache, SWRResponse} from 'swr';
import {Game} from "@/game/game";
import {createGame, getGameState, listGames} from "@/state/client/game";
import {NewGame} from "@/state/schema";

const CURRENT_GAME_KEY = '/game/current'
const LIST_GAMES_KEY = '/game/list'

export function useGame(): SWRResponse<Game | null> {
    const { cache } = useSWRConfig()
    return useSWR(CURRENT_GAME_KEY, () => cache.get(CURRENT_GAME_KEY)?.data || null)
}

export function useSelectGame(): (id: number) => Promise<Game | null> {
    const { mutate } = useGame()
    return async (id: number) =>
        await mutate(async () => {
            const game = await getGameState(id)
            // TODO determine player ID from username
            return game ? new Game(1, game) : null
        }) || null
}

export function useDeselectGame(): () => Promise<void> {
    const { mutate } = useGame()
    return async () => {
        await mutate(null)
    }
}

// TODO call based on some notification from the server
export function useRevalidateServerState(): () => Promise<Game | null> {
    const { mutate } = useGame()
    return async () => await mutate(async (game) => {
        if (!game) {
            return null
        }
        const serverState = await getGameState(game.id)
        if (!serverState) {
            return null
        }
        return game.sync(serverState)
    }) || null
}

export function useCreateGame(): (newGame: NewGame) => Promise<void> {
    const { mutate } = useSWRConfig()
    return async (newGame) => {
        await createGame(newGame)
        await mutate(LIST_GAMES_KEY)
    }
}

export function useGameList() {
    return useSWR(LIST_GAMES_KEY, listGames)
}