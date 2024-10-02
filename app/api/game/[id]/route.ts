import {notFound, OkOrErrorResponse, toApiError} from "@/app/api/api-error";
import {GameState} from "@/game";
import {gameService} from "@/server/service";
import {NextRequest, NextResponse} from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
): Promise<OkOrErrorResponse<GameState>> {
    const id = parseInt(params.id, 10)
    if (isNaN(id)) {
        return notFound('game')
    }

    try {
        const game = await gameService(request).then(db => db.getGame(id))
        if (!game) {
            return notFound('game')
        }
        return NextResponse.json(game)
    } catch (e) {
        return toApiError(e)
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
): Promise<OkOrErrorResponse<GameState>> {
    const id = parseInt(params.id, 10)
    if (isNaN(id)) {
        return notFound('game')
    }

    try {
        const body = await request.json()
        const game = await gameService(request).then(db => db.updateGame(id, body))
        if (!game) {
            return notFound('game')
        }
        return NextResponse.json(game)
    } catch (e) {
        return toApiError(e)
    }
}