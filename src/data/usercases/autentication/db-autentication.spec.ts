import type { AccountModel } from '../add-account/db-add-account-protocols.ts'
import type { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository.ts'
import type { Autentication, AutenticationParams } from '../../../domain/usecases/autentication.ts'
import { DBAutenticationUseCase } from './db-autentication.ts'
import type { HashComparer } from '../../protocols/criptoghraphy/has-comparer.ts'

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'hashed_password',
})

const makeFakeAutenticationParams = (): AutenticationParams => ({
    email: 'valid_email@mail.com',
    password: 'any_password',
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async loadByEmail(email: string): Promise<AccountModel | null> {
            return await Promise.resolve(makeFakeAccount())
        }
    }
    return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = (): HashComparer => {
    class HashComparerStub implements HashComparer {
        async compare(value: string, hash: string): Promise<boolean> {
            return await Promise.resolve(true)
        }
    }
    return new HashComparerStub()
}

interface SutTypes {
    sut: Autentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashComparerStub: HashComparer
}

const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const hashComparerStub = makeHashComparer()
    const sut = new DBAutenticationUseCase(loadAccountByEmailRepositoryStub, hashComparerStub)
    return { sut, loadAccountByEmailRepositoryStub, hashComparerStub }
}

describe('DBAutenticationUseCase', () => {
    it('Should call loadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
        await sut.auth(makeFakeAutenticationParams())

        expect(loadByEmailSpy).toHaveBeenCalledWith('valid_email@mail.com')
    })

    it('Should throw if loadAccountByEmailRepository throws', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
            Promise.reject(new Error()),
        )
        const promise = sut.auth(makeFakeAutenticationParams())

        await expect(promise).rejects.toThrow()
    })

    it('Should return null if loadAccountByEmailRepository returns null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
            Promise.resolve(null),
        )
        const result = await sut.auth(makeFakeAutenticationParams())

        expect(result).toBeNull()
    })

    it('Should call HashComparer with correct password', async () => {
        const { sut, hashComparerStub } = makeSut()
        const compareSpy = jest.spyOn(hashComparerStub, 'compare')
        await sut.auth(makeFakeAutenticationParams())

        expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
    })

    it('Should return null if HashComparer returns false', async () => {
        const { sut, hashComparerStub } = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
        const result = await sut.auth(makeFakeAutenticationParams())

        expect(result).toBeNull()
    })
})
