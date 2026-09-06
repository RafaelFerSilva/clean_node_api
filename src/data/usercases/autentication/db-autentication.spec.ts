import type {
    AccountModel,
    LoadAccountByEmailRepository,
    Autentication,
    AutenticationParams,
    HashComparer,
    Encrypter,
    UpdateAccessTokenRepository,
} from './db-autentication.protocols.ts'
import { DBAutenticationUseCase } from './db-autentication.ts'

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

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt(id: string): Promise<string> {
            return await Promise.resolve('any_token')
        }
    }
    return new EncrypterStub()
}

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
        async update(id: string, token: string): Promise<void> {
            await Promise.resolve()
        }
    }
    return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
    sut: Autentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashComparerStub: HashComparer
    encrypterStub: Encrypter
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const hashComparerStub = makeHashComparer()
    const encrypterStub = makeEncrypter()
    const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
    const sut = new DBAutenticationUseCase(
        loadAccountByEmailRepositoryStub,
        hashComparerStub,
        encrypterStub,
        updateAccessTokenRepositoryStub,
    )
    return {
        sut,
        loadAccountByEmailRepositoryStub,
        hashComparerStub,
        encrypterStub,
        updateAccessTokenRepositoryStub,
    }
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

    it('Should throw if HashComparer throws', async () => {
        const { sut, hashComparerStub } = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.reject(new Error()))
        const promise = sut.auth(makeFakeAutenticationParams())

        await expect(promise).rejects.toThrow()
    })

    it('Should call Encrypter with correct id', async () => {
        const { sut, encrypterStub } = makeSut()
        const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')
        await sut.auth(makeFakeAutenticationParams())

        expect(encrypterSpy).toHaveBeenCalledWith('valid_id')
    })

    it('Should throw if Encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))
        const promise = sut.auth(makeFakeAutenticationParams())

        await expect(promise).rejects.toThrow()
    })

    it('Should return an AutenticationModel on success', async () => {
        const { sut } = makeSut()
        const authenticationModel = await sut.auth(makeFakeAutenticationParams())

        expect(authenticationModel).toEqual({ accessToken: 'any_token' })
    })

    it('Should call UpdateAccessTokenRepository with correct values', async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut()
        const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
        await sut.auth(makeFakeAutenticationParams())

        expect(updateSpy).toHaveBeenCalledWith('valid_id', 'any_token')
    })

    it('Should throw if UpdateAccessTokenRepository throws', async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut()
        jest.spyOn(updateAccessTokenRepositoryStub, 'update').mockReturnValueOnce(
            Promise.reject(new Error()),
        )
        const promise = sut.auth(makeFakeAutenticationParams())

        await expect(promise).rejects.toThrow()
    })
})
