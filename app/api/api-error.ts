import {typeToFlattenedError, ZodError} from 'zod'
import {NextResponse} from 'next/server'
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/binary";

export interface UnknownApiError {
    message: string
    name: string
}

export type ApiError<T> = UnknownApiError | typeToFlattenedError<T>

export type OkOrErrorResponse<T, E = T> = NextResponse<T | ApiError<E>>

export function toApiError<T>(e: any): NextResponse<ApiError<T>> {
    console.error(e.stack)

    if (!(e instanceof Error)) {
        return NextResponse.json({ message: e?.toString() ?? 'Unknown error', name: 'unknown' }, { status: 500 })
    }

    if (e instanceof UnauthorizedError) {
        return unauthorized()
    }

    if (e instanceof ZodError) {
        return NextResponse.json(e.flatten(), { status: 400 })
    }

    const dbError = tryHandleDbError(e)
    if (dbError !== null) {
        return NextResponse.json(
            { message: dbError.message, name: dbError.name },
            { status: dbError.badRequest ? 400 : 500 }
        )
    }
    return NextResponse.json({ message: e.message.trim(), name: e.name }, { status: 500 })
}

export class UnauthorizedError extends Error {
    constructor() {
        super("User is not authorized");
    }
}

export function unauthorized(): NextResponse<UnknownApiError> {
    return NextResponse.json({
        message: 'You are not authorized',
        name: 'Unauthorized'
    }, { status: 401 })
}

export function notFound(entity: string): NextResponse<UnknownApiError> {
    return NextResponse.json({
        message: `${entity} does not exist`,
        name: 'NotFound'
    }, { status: 404 })
}

export class DbError extends Error {
    constructor(
        readonly message: string,
        readonly badRequest: boolean
    ) {
        super(message)
    }
}

export function tryHandleDbError(e: Error): DbError | null {
    if (e instanceof DbError) {
        return e
    }

    if (!(e instanceof PrismaClientKnownRequestError)) {
        return null
    }
    let badRequest = false
    // https://www.prisma.io/docs/orm/reference/error-reference#error-codes
    switch (e.code) {
        case 'P2000':
        case 'P2001':
        case 'P2002':
        case 'P2003':
        case 'P2004':
        case 'P2005':
        case 'P2006':
        case 'P2007':
            badRequest = true
            break
    }
    const message = e.message.split('\n')
            .map(line => line.trim())
            .findLast(line => line)
        || 'unknown error'
    return new DbError(`${e.code}: ${message}`, badRequest)
}