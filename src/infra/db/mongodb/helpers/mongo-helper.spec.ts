import { MongoHelper } from './mongo-helper.ts'

describe('Mongo Helper', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL ?? '')
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    test('should reconnect if mongodb is down', async () => {
        const accountCollection = await MongoHelper.getCollection('accounts')
        expect(accountCollection).toBeTruthy()
        await MongoHelper.disconnect()
        const accountCollection2 = await MongoHelper.getCollection('accounts')
        expect(accountCollection2).toBeTruthy()
    })

    test('should cover branch when url is null', async () => {
        const { url } = MongoHelper
        Object.assign(MongoHelper, { url: null })
        await MongoHelper.disconnect()
        await expect(MongoHelper.getCollection('accounts')).rejects.toThrow()
        Object.assign(MongoHelper, { url })
    })

    test('should throw error if client is still null after connect', async () => {
        await MongoHelper.disconnect()
        jest.spyOn(MongoHelper, 'connect').mockReturnValueOnce(Promise.resolve())
        await expect(MongoHelper.getCollection('accounts')).rejects.toThrow(
            'Mongo client is not connected',
        )
    })
})
