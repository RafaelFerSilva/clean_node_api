import request from 'supertest'
import app from '../config/app.ts'

describe('Content Type Middleware', () => {
    it('Should return default content type as json', async () => {
        app.get('/test_content_type', (_req, res) => {
            res.send({ ok: true })
        })
        await request(app).get('/test_content_type').expect('content-type', /json/v)
    })

    it('Should return content type as xml', async () => {
        app.get('/test_content_type_xml', (_req, res) => {
            res.type('xml')
            res.send('')
        })
        await request(app).get('/test_content_type_xml').expect('content-type', /xml/v)
    })
})
