import type {
    HttpRequest,
    HttpResponse,
    Controller,
    AddAccount,
    Validation,
    Autentication,
} from './signup-controller-protocols.ts'
import { badRequest, ok, serverError } from '../../helpers/http/http-helper.ts'

export class SignUpController implements Controller {
    private readonly addAccount: AddAccount
    private readonly validation: Validation
    private readonly autentication: Autentication

    constructor(addAccount: AddAccount, validation: Validation, autentication: Autentication) {
        this.addAccount = addAccount
        this.validation = validation
        this.autentication = autentication
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body)

            if (error) {
                return badRequest(error)
            }

            const { name, email, password } = httpRequest.body as Record<string, string>

            const account = await this.addAccount.add({ name, email, password })

            await this.autentication.auth({ email, password })

            return ok(account)
        } catch (error) {
            return serverError(error as Error)
        }
    }
}
