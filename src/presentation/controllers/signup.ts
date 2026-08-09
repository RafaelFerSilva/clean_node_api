import type { HttpRequest, HttpResponse, Controller, EmailValidator } from '../protocols/index.ts'
import { badRequest, serverError } from '../helpers/http-helper.ts'
import { MissingParamError, InvalidParamError } from '../errors/index.ts'

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

            const { email, password, passwordConfirmation } = body as Record<string, string>

            if (password !== passwordConfirmation) {
                return badRequest(new InvalidParamError('passwordConfirmation'))
            }

            const isValid = this.emailValidator.isValid(email)
            if (!isValid) {
                return badRequest(new InvalidParamError('email'))
            }

            return {
                statusCode: 200,
                body: {},
            }
        } catch (error) {
            return serverError()
        }
    }
}
