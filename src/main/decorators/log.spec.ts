import type {
    Controller,
    HttpRequest,
    HttpResponse,
} from '../../presentation/controllers/signup/signup-protocols.ts'
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

interface SutTypes {
    sut: Controller
    controllerStub: Controller
}

const makeSut = (): SutTypes => {
    const controllerStub = makeController()
    const sut = new LogControllerDecorator(controllerStub)
    return { sut, controllerStub }
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
})
