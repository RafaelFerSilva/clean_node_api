import express from 'express'
import setupMiddlewares from './middlewares.ts'

const app = express()
setupMiddlewares(app)

export default app
