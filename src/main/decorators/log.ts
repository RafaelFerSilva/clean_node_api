import type { LogErrorRepository } from '../../data/protocols/log-error-repository.ts'
import type {
    Controller,
    HttpRequest,
    HttpResponse,
} from '../../presentation/controllers/signup/signup-protocols.ts'

export class LogControllerDecorator implements Controller {
    constructor(
        private readonly controller: Controller,
        private readonly logErrorRepository: LogErrorRepository,
    ) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse = await this.controller.handle(httpRequest)

        if (httpResponse.statusCode === 500) {
            const error = httpResponse.body as Error
            await this.logErrorRepository.logError(error.stack ?? '')
        }

        return httpResponse
    }
}
