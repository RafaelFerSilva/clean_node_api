import { SignUpController } from '../../presentation/controllers/signup/signup.ts'
import { DbAddAccount } from '../../data/usercases/add-account/db-add-account.ts'
import { BcryptAdapter } from '../../infra/criptography/bcript-dapter.ts'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account.ts'
import type { Controller } from '../../presentation/controllers/signup/signup-protocols.ts'
import { LogControllerDecorator } from '../decorators/log.ts'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/logs.ts'
import { makeSignUpValidation } from './signup-validation.ts'

export const makeSignUpController = (): Controller => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
    const signUpController = new SignUpController(dbAddAccount, makeSignUpValidation())
    const logMongoRepository = new LogMongoRepository()
    return new LogControllerDecorator(signUpController, logMongoRepository)
}
