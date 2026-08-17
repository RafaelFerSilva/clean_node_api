import { SignUpController } from '../../presentation/controllers/signup/signup.ts'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter.ts'
import { DbAddAccount } from '../../data/usercases/add-account/db-add-account.ts'
import { BcryptAdapter } from '../../infra/criptography/bcript-dapter.ts'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account.ts'

export const makeSignUpController = (): SignUpController => {
    const emailValidatorAdapter = new EmailValidatorAdapter()
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
    return new SignUpController(emailValidatorAdapter, dbAddAccount)
}
