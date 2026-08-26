import type {
    HttpRequest,
    HttpResponse,
    Controller,
    EmailValidator,
    AddAccount,
    Validation,
} from './signup-protocols.ts'
import { badRequest, ok, serverError } from '../../helpers/http-helper.ts'
import { MissingParamError, InvalidParamError } from '../../errors/index.ts'

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator
    private readonly addAccount: AddAccount
    private readonly validation: Validation

    constructor(emailValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
        this.emailValidator = emailValidator
        this.addAccount = addAccount
        this.validation = validation
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body)

            if (error) {
                return badRequest(error)
            }

            const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
            const body = httpRequest.body as Record<string, unknown>

            for (const field of requiredFields) {
                if (!body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }

            const { name, email, password, passwordConfirmation } = body as Record<string, string>

            if (password !== passwordConfirmation) {
                return badRequest(new InvalidParamError('passwordConfirmation'))
            }

            const isValid = this.emailValidator.isValid(email)
            if (!isValid) {
                return badRequest(new InvalidParamError('email'))
            }

            const account = await this.addAccount.add({ name, email, password })

            return ok(account)
        } catch (error) {
            return serverError(error as Error)
        }
    }
}
