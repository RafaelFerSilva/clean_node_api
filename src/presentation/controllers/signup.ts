import type { HttpRequest, HttpResponse } from '../protocols/http.ts'
import { MissingParamError } from '../errors/missing-param-error.ts'
import { badRequest } from '../helpers/http-helper.ts'
import type { Controller } from '../protocols/controller.ts'
import type { EmailValidator } from '../protocols/email-validator.ts'
import { InvalidParamError } from '../errors/invalid-param-error.ts'
import { ServerError } from '../errors/server-error.ts'

export class SignUpController implements Controller {
    constructor(private readonly emailValidator: EmailValidator) {}

    handle(httpRequest: HttpRequest): HttpResponse {
        try {
            const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
            const body = httpRequest.body as Record<string, unknown>

            for (const field of requiredFields) {
                if (!body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }

            const { email } = body
            const isValid = this.emailValidator.isValid(email as string)
            if (!isValid) {
                return badRequest(new InvalidParamError('email'))
            }

            return {
                statusCode: 200,
                body: {},
            }
        } catch (error) {
            return {
                statusCode: 500,
                body: new ServerError(),
            }
        }
    }
}
