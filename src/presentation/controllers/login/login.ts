import type { Autentication } from '../../../domain/usecases/autentication.ts'
import { InvalidParamError } from '../../errors/invalid-param-error.ts'
import { MissingParamError } from '../../errors/missing-param-error.ts'
import { badRequest, serverError } from '../../helpers/http-helper.ts'
import type { HttpRequest, HttpResponse, Controller, EmailValidator } from './login-protocols.ts'

export class LoginController implements Controller {
    constructor(
        private readonly emailValidator: EmailValidator,
        private readonly autentication: Autentication,
    ) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            await Promise.resolve()
            const requiredFields = ['email', 'password']
            const body = httpRequest.body as Record<string, unknown>

            for (const field of requiredFields) {
                if (!body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }

            const { email, password } = httpRequest.body as { email: string; password: string }

            const isValid = this.emailValidator.isValid(email)
            if (!isValid) {
                return badRequest(new InvalidParamError('email'))
            }

            await this.autentication.auth(email, password)
        } catch (error) {
            return serverError(error as Error)
        }
    }
}
