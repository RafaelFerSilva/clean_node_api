import type { HttpRequest, HttpResponse } from '../protocols/http.ts'
import { MissingParamError } from '../errors/missing-param-error.ts'

export class SignUpController {
    handle(httpRequest: HttpRequest): HttpResponse | undefined {
        const body = httpRequest.body as { name?: string; email?: string } | undefined
        if (!body?.name) {
            return {
                statusCode: 400,
                body: new MissingParamError('name'),
            }
        }
        if (!body.email) {
            return {
                statusCode: 400,
                body: new MissingParamError('email'),
            }
        }
    }
}
