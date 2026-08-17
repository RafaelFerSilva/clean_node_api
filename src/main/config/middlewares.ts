import type { Express } from 'express'
import { bodyParser } from '../middlewares/body-parser.js'

export default (app: Express): void => {
    app.use(bodyParser)
}
