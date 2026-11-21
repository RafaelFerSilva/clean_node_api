import env from '../../config/env.ts'
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller.ts'
import { DbAddAccount } from '../../../data/usercases/add-account/db-add-account.ts'
import { DBAutenticationUseCase } from '../../../data/usercases/autentication/db-autentication.ts'
import { BcryptAdapter } from '../../../infra/criptography/bcript-adapter/bcript-dapter.ts'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter.ts'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository.ts'
import type { Controller } from '../../../presentation/controllers/signup/signup-controller-protocols.ts'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator.ts'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/logs-mongo-repository.ts'
import { makeSignUpValidation } from './signup-validation-factory.ts'

export const makeSignUpController = (): Controller => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
    const dbAutentication = new DBAutenticationUseCase(
        accountMongoRepository,
        bcryptAdapter,
        jwtAdapter,
        accountMongoRepository,
    )
    const signUpController = new SignUpController(
        dbAddAccount,
        makeSignUpValidation(),
        dbAutentication,
    )
    const logMongoRepository = new LogMongoRepository()
    return new LogControllerDecorator(signUpController, logMongoRepository)
}
