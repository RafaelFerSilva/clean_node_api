import type { AccountModel } from '../add-account/db-add-account-protocols.ts'
import type { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository.ts'
import type { Autentication } from '../../../domain/usecases/autentication.ts'
import { DBAutenticationUseCase } from './db-autentication.ts'

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel | null> {
        const fakeAccount = {
            id: 'valid_id',
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'hashed_password',
        }
        return await Promise.resolve(fakeAccount)
    }
}

interface SutTypes {
    sut: Autentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
    const sut = new DBAutenticationUseCase(loadAccountByEmailRepositoryStub)
    return { sut, loadAccountByEmailRepositoryStub }
}

describe('DBAutenticationUseCase', () => {
    it('Should call loadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
        await sut.auth({
            email: 'any_email@mail.com',
            password: '[PASSWORD]',
        })

        expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
    })
})
