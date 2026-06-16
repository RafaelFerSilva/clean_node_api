import type { HttpRequest, HttpResponse } from '../protocols/http.ts'

export class SignUpController {
    handle(httpRequest: HttpRequest): HttpResponse | undefined {
        const body = httpRequest.body as { name?: string; email?: string } | undefined
        if (!body?.name) {
            return {
                statusCode: 400,
                body: new Error('Missing param: name'),
            }
        }
        if (!body.email) {
            return {
                statusCode: 400,
                body: new Error('Missing param: email'),
            }
        }
    }
}
