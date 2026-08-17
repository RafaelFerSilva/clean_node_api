import { MongoHelper } from './mongo-helper.ts'

describe('Mongo Helper', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL ?? '')
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    test('should throw if getting collection and not connected', async () => {
        await MongoHelper.disconnect()
        expect(() => {
            MongoHelper.getCollection('accounts')
        }).toThrow('Mongo client is not connected')
    })
})
