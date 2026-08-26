import type { AccountModel } from '../add-account/db-add-account-protocols.ts'
import type { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository.ts'
import type { Autentication, AutenticationParams } from '../../../domain/usecases/autentication.ts'
import { DBAutenticationUseCase } from './db-autentication.ts'

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'hashed_password',
})

const makeFakeAutenticationParams = (): AutenticationParams => ({
    email: 'valid_email@mail.com',
    password: '[PASSWORD]',
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async loadByEmail(email: string): Promise<AccountModel | null> {
            return await Promise.resolve(makeFakeAccount())
        }
    }
    return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
    sut: Autentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const sut = new DBAutenticationUseCase(loadAccountByEmailRepositoryStub)
    return { sut, loadAccountByEmailRepositoryStub }
}

describe('DBAutenticationUseCase', () => {
    it('Should call loadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
        await sut.auth(makeFakeAutenticationParams())

        expect(loadByEmailSpy).toHaveBeenCalledWith('valid_email@mail.com')
    })
})
