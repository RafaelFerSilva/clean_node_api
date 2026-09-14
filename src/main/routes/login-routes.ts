import type { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-router-adapter.ts'
import { makeSignUpController } from '../factories/signup/signup-factory.ts'
import { makeLoginController } from '../factories/login/login-factory.ts'

export default (router: Router): void => {
    router.post('/signup', adaptRoute(makeSignUpController()))
    router.post('/login', adaptRoute(makeLoginController()))
}
