import env from '../../config/env.ts'
import type { Controller } from '../../../presentation/controllers/signup/signup-controller-protocols.ts'
import { DBAutenticationUseCase } from '../../../data/usercases/autentication/db-autentication.ts'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator.ts'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/logs-mongo-repository.ts'
import { makeLoginValidation } from './login-validation-factory.ts'
import { LoginController } from '../../../presentation/controllers/login/login-controller.ts'
import { BcryptAdapter } from '../../../infra/criptography/bcript-adapter/bcript-dapter.ts'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository.ts'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter.ts'

export const makeLoginController = (): Controller => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    const dbAutentication = new DBAutenticationUseCase(
        accountMongoRepository,
        bcryptAdapter,
        jwtAdapter,
        accountMongoRepository,
    )
    const loginController = new LoginController(dbAutentication, makeLoginValidation())
    const logMongoRepository = new LogMongoRepository()
    return new LogControllerDecorator(loginController, logMongoRepository)
}
