import {OkOrErrorResponse, toApiError} from "@/app/api/api-error";
import {gameService} from "@/server/service";
import {NextRequest, NextResponse} from "next/server";
import {GameState, GameSummary} from "@/game";

export const dynamic = 'force-dynamic'

export async function GET(): Promise<OkOrErrorResponse<GameSummary[]>> {
    try {
        const games = await gameService().then(db => db.getGames())
        return NextResponse.json(games)
    } catch (e) {
        return toApiError(e)
    }
}

export async function POST(request: NextRequest): Promise<OkOrErrorResponse<GameState>> {
    try {
        const newGame = await request.json()
        const result = await gameService().then(db => db.createGame(newGame))
        return NextResponse.json(result)
    } catch (e) {
        return toApiError(e)
    }
}