import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helper.ts'
import type {
    HttpRequest,
    HttpResponse,
    Controller,
    Validation,
    Autentication,
} from './login-protocols.ts'

export class LoginController implements Controller {
    constructor(
        private readonly autentication: Autentication,
        private readonly validation: Validation,
    ) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body)
            if (error) {
                return badRequest(error)
            }

            const { email, password } = httpRequest.body as { email: string; password: string }
            const result = await this.autentication.auth({ email, password })

            if (!result) {
                return unauthorized()
            }

            return ok(result)
        } catch (error) {
            return serverError(error as Error)
        }
    }
}
