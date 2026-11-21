import { SignUpController } from './signup-controller.ts'
import { MissingParamError } from '../../errors/index.ts'
import type {
    AddAccount,
    AddAccountModel,
    AccountModel,
    HttpRequest,
    Validation,
    Autentication,
    AutenticationModel,
    AutenticationParams,
} from './signup-controller-protocols.ts'
import { badRequest, serverError, ok } from '../../helpers/http/http-helper.ts'

interface FakeRequest extends HttpRequest {
    body: {
        name?: string
        email?: string
        password?: string
        passwordConfirmation?: string
    }
}

const makeFakeRequest = (): FakeRequest => ({
    body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
    },
})

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
})

const makeAutenticationStub = (): Autentication => {
    class AutenticationStub implements Autentication {
        async auth(autentication: AutenticationParams): Promise<AutenticationModel | null> {
            await Promise.resolve()
            return { accessToken: 'any_token' }
        }
    }
    return new AutenticationStub()
}

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        async add(account: AddAccountModel): Promise<AccountModel> {
            return await Promise.resolve(makeFakeAccount())
        }
    }
    return new AddAccountStub()
}

interface SutTypes {
    sut: SignUpController
    validationStub: Validation
    addAccountStub: AddAccount
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

const makeSut = (): SutTypes => {
    const addAccountStub = makeAddAccount()
    const validationStub = makeValidation()
    const autenticationStub = makeAutenticationStub()
    const sut = new SignUpController(addAccountStub, validationStub, autenticationStub)
    return { sut, addAccountStub, validationStub, autenticationStub }
}

const mockRequest = (): HttpRequest => ({
    body: {
        email: 'any_email@email.com',
        password: 'any_password',
    },
})

describe('SignUp Controller', () => {
    test('Should return 500 if addAccount throws', async () => {
        const { sut, addAccountStub } = makeSut()
        const error = new Error()
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(
            async () => await Promise.reject(error),
        )

        const httpRequest = makeFakeRequest()
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(serverError(error))
    })

    test('Should call AddAccount with correct values', async () => {
        const { sut, addAccountStub } = makeSut()
        const addSpy = jest.spyOn(addAccountStub, 'add')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(addSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password',
        })
    })

    test('Should return 200 if valid data is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = makeFakeRequest()
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(ok(makeFakeAccount()))
    })

    test('Should call Validation with correct values', async () => {
        const { sut, validationStub } = makeSut()
        const validateSpy = jest.spyOn(validationStub, 'validate')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('Should return 400 if validation returns an error', async () => {
        const { sut, validationStub } = makeSut()
        const error = new MissingParamError('any_field')
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(error)

        const httpRequest = makeFakeRequest()
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(error))
    })

    test('Should call Autentication with correct values', async () => {
        const { sut, autenticationStub } = makeSut()
        const authSpy = jest.spyOn(autenticationStub, 'auth')
        await sut.handle(mockRequest())
        expect(authSpy).toHaveBeenCalledWith({
            email: 'any_email@email.com',
            password: 'any_password',
        })
    })
})
