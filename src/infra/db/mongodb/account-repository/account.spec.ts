import { AccountMongoRepository } from './account.ts'
import { MongoHelper } from '../helpers/mongo-helper.ts'
import type { Collection } from 'mongodb'

describe('Account Mongodb Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL ?? '')
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        const accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    const makeSut = (): AccountMongoRepository => new AccountMongoRepository()

    test('should return an account on success', async () => {
        const sut = makeSut()
        const accountData = {
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password',
        }
        const account = await sut.add(accountData)
        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe(accountData.name)
        expect(account.email).toBe(accountData.email)
        expect(account.password).toBe(accountData.password)
    })
    test('should throw if account is not found after insert', async () => {
        const sut = makeSut()
        const accountData = {
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password',
        }
        jest.spyOn(MongoHelper, 'getCollection').mockReturnValueOnce(
            Promise.resolve({
                insertOne: jest.fn().mockReturnValueOnce(Promise.resolve({ insertedId: 'any_id' })),
                findOne: jest.fn().mockReturnValueOnce(Promise.resolve(null)),
            } as unknown as Collection),
        )
        const promise = sut.add(accountData)
        await expect(promise).rejects.toThrow('Account not found')
    })
})
