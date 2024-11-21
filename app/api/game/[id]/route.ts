import {notFound, OkOrErrorResponse, toApiError} from "@/app/api/api-error";
import {GameState} from "@/game";
import {gameService} from "@/server/service";
import {NextRequest, NextResponse} from "next/server";

export const dynamic = 'force-dynamic'

export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<OkOrErrorResponse<GameState>> {
    const { id: idString } = await params
    const id = parseInt(idString, 10)
    if (isNaN(id)) {
        return notFound('game')
    }

    try {
        const game = await gameService().then(db => db.getGame(id))
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
    { params }: { params: Promise<{ id: string }> }
): Promise<OkOrErrorResponse<GameState>> {
    const { id: idString } = await params
    const id = parseInt(idString, 10)
    if (isNaN(id)) {
        return notFound('game')
    }

    try {
        const body = await request.json()
        const game = await gameService().then(db => db.updateGame(id, body))
        if (!game) {
            return notFound('game')
        }
        return NextResponse.json(game)
    } catch (e) {
        return toApiError(e)
    }
}