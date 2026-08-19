import { SignUpController } from './signup.ts'
import { MissingParamError, InvalidParamError } from '../../errors/index.ts'
import type {
    EmailValidator,
    AddAccount,
    AddAccountModel,
    AccountModel,
    HttpRequest,
} from './signup-protocols.ts'
import { badRequest, serverError, ok } from '../../../presentation/helpers/http-helper.ts'

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

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
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
    emailValidatorStub: EmailValidator
    addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const addAccountStub = makeAddAccount()
    const sut = new SignUpController(emailValidatorStub, addAccountStub)
    return { sut, emailValidatorStub, addAccountStub }
}

describe('SignUp Controller', () => {
    test('Should return 400 if no name is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = makeFakeRequest()
        delete httpRequest.body.name
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
    })

    test('Should return 400 if no email is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = makeFakeRequest()
        delete httpRequest.body.email
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })

    test('Should return 400 if no password is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = makeFakeRequest()
        delete httpRequest.body.password
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    })

    test('Should return 400 if no passwordConfirmation is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = makeFakeRequest()
        delete httpRequest.body.passwordConfirmation
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
    })

    test('Should return 400 if passwordConfirmation fails', async () => {
        const { sut } = makeSut()
        const httpRequest = makeFakeRequest()
        httpRequest.body.passwordConfirmation = 'invalid_password_confirmation'
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
    })

    test('Should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

        const httpRequest = makeFakeRequest()
        httpRequest.body.email = 'invalid_email@mail.com'
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
    })

    test('Should call emailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
    })

    test('Should return 500 if emailValidator throws', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const error = new Error()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw error
        })

        const httpRequest = makeFakeRequest()
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(serverError(error))
    })

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
})
