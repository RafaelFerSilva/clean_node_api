import request from 'supertest'
import app from '../config/app.ts'

describe('Body Parser Middleware', () => {
    app.post('/test_body_parser', (req, res) => {
        res.send(req.body)
    })

    it('Should parse body as JSON', async () => {
        await request(app)
            .post('/test_body_parser')
            .send({ name: 'any_name' })
            .expect({ name: 'any_name' })
    })
})
