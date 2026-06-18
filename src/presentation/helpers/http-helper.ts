import type { HttpResponse } from '../protocols/http.ts'

export const badRequest = (error: Error): HttpResponse => ({
    statusCode: 400,
    body: error,
})

export const ok = (data: unknown): HttpResponse => ({
    statusCode: 200,
    body: data,
})
