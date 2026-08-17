import express from 'express'
import setupMiddlewares from './middlewares.ts'
import setupRoutes from './routes.ts'

const app = express()
setupMiddlewares(app)
setupRoutes(app)

export default app
