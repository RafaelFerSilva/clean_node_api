import type { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-router-adapter.ts'
import { makeSignUpController } from '../factories/signup/signup-factory.ts'

export default (router: Router): void => {
    router.post('/signup', adaptRoute(makeSignUpController()))
}
