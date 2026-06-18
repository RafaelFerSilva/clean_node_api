import type { HttpRequest, HttpResponse } from '../protocols/http.ts'
import { MissingParamError } from '../errors/missing-param-error.ts'
import { badRequest } from '../helpers/http-helper.ts'

export class SignUpController {
    handle(httpRequest: HttpRequest): HttpResponse | undefined {
        const requiredFields = ['name', 'email']
        const body = (httpRequest.body ?? {}) as Record<string, unknown>
        for (const field of requiredFields) {
            if (!body[field]) {
                return badRequest(new MissingParamError(field))
            }
        }
    }
}
