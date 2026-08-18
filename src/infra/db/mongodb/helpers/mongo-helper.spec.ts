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
})
