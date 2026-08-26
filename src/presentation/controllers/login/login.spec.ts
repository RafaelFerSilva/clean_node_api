import { MissingParamError } from '../../errors/missing-param-error.ts'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helper.ts'
import type { HttpRequest, Autentication, Validation } from './login-protocols.ts'
import { LoginController } from './login.ts'

interface SutTypes {
    sut: LoginController
    validationStub: Validation
    autenticationStub: Autentication
}

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: unknown): Error | null {
            return null
        }
    }
    return new ValidationStub()
}

const makeAutenticationStub = (): Autentication => {
    class AutenticationStub implements Autentication {
        async auth(email: string, password: string): Promise<string | null> {
            await Promise.resolve()
            return 'any_token'
        }
    }
    return new AutenticationStub()
}

const makeSut = (): SutTypes => {
    const validationStub = makeValidation()
    const autenticationStub = makeAutenticationStub()
    const sut = new LoginController(autenticationStub, validationStub)
    return { sut, validationStub, autenticationStub }
}

const mockRequest = (): HttpRequest => ({
    body: {
        email: 'any_email@email.com',
        password: 'any_password',
    },
})

describe('Login Controller', () => {
    test('Should call Validation with correct values', async () => {
        const { sut, validationStub } = makeSut()
        const validateSpy = jest.spyOn(validationStub, 'validate')
        const httpRequest = mockRequest()
        await sut.handle(httpRequest)
        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('Should return 400 if Validation returns an error', async () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(
            new MissingParamError('any_field'),
        )
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
    })

    test('Should call Autentication with correct values', async () => {
        const { sut, autenticationStub } = makeSut()
        const authSpy = jest.spyOn(autenticationStub, 'auth')
        await sut.handle(mockRequest())
        expect(authSpy).toHaveBeenCalledWith('any_email@email.com', 'any_password')
    })

    test('Should return 401 if invalid credentials are provided', async () => {
        const { sut, autenticationStub } = makeSut()
        jest.spyOn(autenticationStub, 'auth').mockReturnValueOnce(Promise.resolve(null))
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(unauthorized())
    })

    test('Should return 500 if Autentication throws', async () => {
        const { sut, autenticationStub } = makeSut()
        jest.spyOn(autenticationStub, 'auth').mockImplementationOnce(() => {
            throw new Error()
        })
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('Should return 200 when valid credentials are provided', async () => {
        const { sut, autenticationStub } = makeSut()
        jest.spyOn(autenticationStub, 'auth').mockReturnValueOnce(Promise.resolve('any_token'))
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
    })
})
