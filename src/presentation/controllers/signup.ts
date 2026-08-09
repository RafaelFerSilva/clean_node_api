import type { HttpRequest, HttpResponse } from '../protocols/http.ts'
import { MissingParamError } from '../errors/missing-param-error.ts'
import { badRequest } from '../helpers/http-helper.ts'
import type { Controller } from '../protocols/controller.ts'

export class SignUpController implements Controller {
    handle(httpRequest: HttpRequest): HttpResponse {
        const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
        const body = (httpRequest.body ?? {}) as Record<string, unknown>
        for (const field of requiredFields) {
            if (!body[field]) {
                return badRequest(new MissingParamError(field))
            }
        }
    }
}
