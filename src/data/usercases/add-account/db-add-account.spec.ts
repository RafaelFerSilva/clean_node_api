import type {
    AccountModel,
    AddAccountModel,
    Hasher,
    AddAccountRepository,
    LoadAccountByEmailRepository,
} from './db-add-account-protocols.ts'
import { DbAddAccount } from './db-add-account.ts'

const makeFakeAccountData = (): AddAccountModel => ({
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'valid_password',
})

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'hashed_password',
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async loadByEmail(email: string): Promise<AccountModel | null> {
            return await Promise.resolve(makeFakeAccount())
        }
    }
    return new LoadAccountByEmailRepositoryStub()
}

const makeHasher = (): Hasher => {
    class HasherStub implements Hasher {
        async hash(value: string): Promise<string> {
            return await Promise.resolve('hashed_password')
        }
    }
    return new HasherStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add(accountData: AddAccountModel): Promise<AccountModel> {
            return await Promise.resolve(makeFakeAccount())
        }
    }
    return new AddAccountRepositoryStub()
}

interface SutTypes {
    sut: DbAddAccount
    hasherStub: Hasher
    addAccountRepositoryStub: AddAccountRepository
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
    const hasherStub = makeHasher()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const sut = new DbAddAccount(
        hasherStub,
        addAccountRepositoryStub,
        loadAccountByEmailRepositoryStub,
    )
    return {
        sut,
        hasherStub,
        addAccountRepositoryStub,
        loadAccountByEmailRepositoryStub,
    }
}

describe('DbAddAccount Usecase', () => {
    test('Should call hasher with correct password', async () => {
        const { sut, hasherStub } = makeSut()
        const hashSpy = jest.spyOn(hasherStub, 'hash')
        await sut.add(makeFakeAccountData())
        expect(hashSpy).toHaveBeenCalledWith('valid_password')
    })

    test('Should throw if hasher throws', async () => {
        const { sut, hasherStub } = makeSut()
        jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
        await expect(sut.add(makeFakeAccountData())).rejects.toThrow()
    })

    test('Should call AddAccountRepository with correct password', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        await sut.add(makeFakeAccountData())
        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_email@email.com',
            password: 'hashed_password',
        })
    })

    test('Should throw if addAccountRepository throws', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
        await expect(sut.add(makeFakeAccountData())).rejects.toThrow()
    })

    test('Should return an account on success', async () => {
        const { sut } = makeSut()
        const account = await sut.add(makeFakeAccountData())
        expect(account).toEqual(makeFakeAccount())
    })

    test('Should call loadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
        await sut.add(makeFakeAccountData())

        expect(loadByEmailSpy).toHaveBeenCalledWith('valid_email@email.com')
    })
})
