import type { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-router-adapter.ts'
import { makeSignUpController } from '../factories/controllers/signup/signup-controller-factory.ts'
import { makeLoginController } from '../factories/controllers/login/login-controller-factory.ts'

export default (router: Router): void => {
    router.post('/signup', adaptRoute(makeSignUpController()))
    router.post('/login', adaptRoute(makeLoginController()))
}
