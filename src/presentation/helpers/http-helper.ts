import { ServerError } from '../errors/index.ts'
import { UnauthorizedError } from '../errors/unalthorized-error.ts'
import type { HttpResponse } from '../protocols/http.ts'

export const badRequest = (error: Error): HttpResponse => ({
    statusCode: 400,
    body: error,
})

export const ok = (data: unknown): HttpResponse => ({
    statusCode: 200,
    body: data,
})

export const serverError = (error: Error): HttpResponse => ({
    statusCode: 500,
    body: new ServerError(error.stack ?? ''),
})

export const unauthorized = (): HttpResponse => ({
    statusCode: 401,
    body: new UnauthorizedError(),
})
