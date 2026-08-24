import { InvalidParamError } from '../../errors/invalid-param-error.ts'
import { MissingParamError } from '../../errors/missing-param-error.ts'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper.ts'
import type { EmailValidator, HttpRequest, Autentication } from './login-protocols.ts'
import { LoginController } from './login.ts'

interface SutTypes {
    sut: LoginController
    emailValidatorStub: EmailValidator
    autenticationStub: Autentication
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }

    return new EmailValidatorStub()
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
    const emailValidatorStub = makeEmailValidator()
    const autenticationStub = makeAutenticationStub()
    const sut = new LoginController(emailValidatorStub, autenticationStub)
    return { sut, emailValidatorStub, autenticationStub }
}

const mockRequest = (): HttpRequest => ({
    body: {
        email: 'any_email@email.com',
        password: 'any_password',
    },
})

describe('Login Controller', () => {
    test('should return an error if no email is provided', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
            body: {
                password: 'any_password',
            },
        }
        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })

    test('should return an error if invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
    })

    test('should return an error if no password is provided', async () => {
        const { sut } = makeSut()
        const httpRequest: HttpRequest = {
            body: {
                email: 'any_email',
            },
        }
        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    })

    test('should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(true)
        await sut.handle(mockRequest())
        expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
    })

    test('Should return 500 if EmailValidator throws', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })
        const httpResponse = await sut.handle(mockRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('Shoul call Autentication with correct values', async () => {
        const { sut, autenticationStub } = makeSut()
        const authSpy = jest.spyOn(autenticationStub, 'auth')
        await sut.handle(mockRequest())
        expect(authSpy).toHaveBeenCalledWith('any_email@email.com', 'any_password')
    })

    test('Should return 401 if invalid credentias are provided', async () => {
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
