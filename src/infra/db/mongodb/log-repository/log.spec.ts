import { MongoHelper } from '../helpers/mongo-helper.ts'
import { LogMongoRepository } from './logs.ts'

describe('Log Mongo Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL ?? '')
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        const errorsCollection = await MongoHelper.getCollection('errors')
        await errorsCollection.deleteMany({})
    })

    test('Should create an error log on success', async () => {
        const sut = new LogMongoRepository()
        await sut.logError('any_error')
        const errorsCollection = await MongoHelper.getCollection('errors')
        const error = await errorsCollection.findOne({ stack: 'any_error' })
        expect(error).toBeTruthy()
        expect(error?.stack).toBe('any_error')
    })
})
