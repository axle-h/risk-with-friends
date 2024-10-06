import {GameState, GameSummary, NewAction} from "@/game";
import {assertOk} from "@/state/error";
import {NewGame} from "@/game/schema";

type Raw<T> = {
    [P in keyof T]: T[P] extends Date
        ? string
        : T[P] extends object
            ? Raw<T[P]>
            : T[P];
}

function toGameState(state: Raw<GameState>): GameState {
    return {
        ...state,
        dateStarted: new Date(state.dateStarted),
        dateUpdated: new Date(state.dateUpdated),
        events: state.events.map(e => ({ ...e, date: new Date(e.date) })),
    }
}

export async function getGameState(id: number): Promise<GameState | null> {
    const response = await fetch(`/api/game/${id}`)
    if (response.status === 404) {
        return null
    }
    await assertOk(response, 'get game')
    return toGameState(await response.json())
}

export async function listGames(): Promise<GameSummary[]> {
    const response = await fetch('/api/game')
    await assertOk(response, 'list games')
    const states: Raw<GameSummary>[] = await response.json()
    return states.map(state => ({
        ...state,
        dateStarted: new Date(state.dateStarted),
        dateUpdated: new Date(state.dateUpdated),
    }))
}

export async function createGame(request: NewGame): Promise<GameState> {
    const response = await fetch('/api/game', {
        method: 'POST',
        body: JSON.stringify(request)
    })
    await assertOk(response, 'create game')
    return toGameState(await response.json())
}

export async function updateGame(id: number, newAction: NewAction): Promise<GameState | null> {
    const response = await fetch(`/api/game/${id}`, {
        method: 'PUT',
        body: JSON.stringify(newAction)
    })
    if (response.status === 404) {
        return null
    }
    await assertOk(response, 'update game')
    return toGameState(await response.json())
}