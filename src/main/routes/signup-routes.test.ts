import request from 'supertest'
import app from '../config/app.ts'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper.ts'

describe('Signup Routes', () => {
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

    test('Should return 200 when signup is successful', async () => {
        await request(app)
            .post('/api/signup')
            .send({
                name: 'Rafael',
                email: 'rafael@silva.com',
                password: '123',
                passwordConfirmation: '123',
            })
            .expect(200)
    })
})
