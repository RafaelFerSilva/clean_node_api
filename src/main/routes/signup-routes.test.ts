import request from 'supertest'
import app from '../config/app.js'

describe('Signup Routes', () => {
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
