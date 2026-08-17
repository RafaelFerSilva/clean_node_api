import type { Express } from 'express'
import { bodyParser } from '../middlewares/body-parser.js'
import { cors } from '../middlewares/cors.js'

export default (app: Express): void => {
    app.use(bodyParser)
    app.use(cors)
}
