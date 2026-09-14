import request from 'supertest'
import app from '../config/app.ts'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper.ts'
import { hash } from 'bcrypt'

describe('Login Routes', () => {
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

    describe('POST /signup', () => {
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

    describe('POST /login', () => {
        test('Should return 200 when login is successful', async () => {
            const accountCollection = await MongoHelper.getCollection('accounts')
            const password = await hash('123', 12)
            await accountCollection.insertOne({
                name: 'Rafael',
                email: 'rafael@silva.com',
                password,
            })
            await request(app)
                .post('/api/login')
                .send({
                    email: 'rafael@silva.com',
                    password: '123',
                })
                .expect(200)
        })
    })
})
