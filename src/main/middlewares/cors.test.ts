import request from 'supertest'
import app from '../config/app.ts'

describe('CORS Middleware', () => {
    it('Should enable CORS', async () => {
        app.get('/test_cors', (_req, res) => {
            res.send('ok')
        })
        await request(app)
            .get('/test_cors')
            .expect('access-control-allow-origin', '*')
            .expect('access-control-allow-methods', '*')
            .expect('access-control-allow-headers', '*')
    })
})
