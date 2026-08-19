import type { LogErrorRepository } from '../../data/protocols/log-error-repository.ts'
import type {
    Controller,
    HttpRequest,
    HttpResponse,
} from '../../presentation/controllers/signup/signup-protocols.ts'
import { serverError } from '../../presentation/helpers/http-helper.ts'
import { LogControllerDecorator } from './log.ts'

const makeController = (): Controller => {
    class ControllerStub implements Controller {
        async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
            const httpResponse: HttpResponse = { statusCode: 200, body: 'any_body' }
            return await Promise.resolve(httpResponse)
        }
    }
    return new ControllerStub()
}

const makeLogErrorRepository = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
        async logError(_error: string): Promise<void> {
            await Promise.resolve()
        }
    }
    return new LogErrorRepositoryStub()
}

interface SutTypes {
    sut: Controller
    controllerStub: Controller
    logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
    const controllerStub = makeController()
    const logErrorRepositoryStub = makeLogErrorRepository()
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
    return { sut, controllerStub, logErrorRepositoryStub }
}

describe('LogControllerDecorator', () => {
    it('should return the same response as the controller', async () => {
        const { sut, controllerStub } = makeSut()
        const handleSpy = jest.spyOn(controllerStub, 'handle')
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@test.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        }
        const response = await sut.handle(httpRequest)
        expect(response).toEqual({ statusCode: 200, body: 'any_body' })
        expect(handleSpy).toHaveBeenCalledWith(httpRequest)
    })

    it('should call controller handle method with correct values', async () => {
        const { sut, controllerStub } = makeSut()
        const handleSpy = jest.spyOn(controllerStub, 'handle')
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@test.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(handleSpy).toHaveBeenCalledWith(httpRequest)
        expect(httpResponse).toEqual({ statusCode: 200, body: 'any_body' })
    })

    it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
        const fakeError: Error = new Error()
        fakeError.stack = 'any_stack'
        const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
            Promise.resolve(serverError(fakeError)),
        )
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@test.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        }
        await sut.handle(httpRequest)
        expect(logSpy).toHaveBeenCalledWith('any_stack')
    })
})
