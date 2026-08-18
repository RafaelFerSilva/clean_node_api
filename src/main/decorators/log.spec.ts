import type {
    Controller,
    HttpRequest,
    HttpResponse,
} from '../../presentation/controllers/signup/signup-protocols.ts'
import { LogControllerDecorator } from './log.ts'

describe('LogControllerDecorator', () => {
    it('should return the same response as the controller', async () => {
        class ControllerStub implements Controller {
            async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
                const httpResponse: HttpResponse = { statusCode: 200, body: 'any_body' }
                return await Promise.resolve(httpResponse)
            }
        }

        const controller = new ControllerStub()
        const handleSpy = jest.spyOn(controller, 'handle')
        const sut = new LogControllerDecorator(controller)
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
