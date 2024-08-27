import {GameState, GameSummary} from "@/game";
import {assertOk} from "@/state/error";
import {NewGame} from "@/state";

export async function getGameState(id: number): Promise<GameState | null> {
    const response = await fetch(`/api/game/${id}`)
    if (response.status === 404) {
        return null
    }
    await assertOk(response, 'get game')
    return response.json()
}

export async function listGames(): Promise<GameSummary[]> {
    const response = await fetch('/api/game')
    await assertOk(response, 'list games')
    return response.json()
}

export async function createGame(request: NewGame) {
    const response = await fetch('/api/game', {
        method: 'POST',
        body: JSON.stringify(request)
    })
    await assertOk(response, 'create game')
    return response.json()
}