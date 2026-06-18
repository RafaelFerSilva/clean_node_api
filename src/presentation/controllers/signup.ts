import type { HttpRequest, HttpResponse } from '../protocols/http.ts'
import { MissingParamError } from '../errors/missing-param-error.ts'
import { badRequest } from '../helpers/http-helper.ts'

export class SignUpController {
    handle(httpRequest: HttpRequest): HttpResponse | undefined {
        const body = httpRequest.body as { name?: string; email?: string } | undefined
        if (!body?.name) {
            return badRequest(new MissingParamError('name'))
        }
        if (!body.email) {
            return badRequest(new MissingParamError('email'))
        }
    }
}
