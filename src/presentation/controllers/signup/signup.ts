import type {
    HttpRequest,
    HttpResponse,
    Controller,
    AddAccount,
    Validation,
} from './signup-protocols.ts'
import { badRequest, ok, serverError } from '../../helpers/http/http-helper.ts'

export class SignUpController implements Controller {
    private readonly addAccount: AddAccount
    private readonly validation: Validation

    constructor(addAccount: AddAccount, validation: Validation) {
        this.addAccount = addAccount
        this.validation = validation
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body)

            if (error) {
                return badRequest(error)
            }

            const { name, email, password } = httpRequest.body as Record<string, string>

            const account = await this.addAccount.add({ name, email, password })

            return ok(account)
        } catch (error) {
            return serverError(error as Error)
        }
    }
}
