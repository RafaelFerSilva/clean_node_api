import { BcryptAdapter } from '../../../../infra/criptography/bcript-adapter/bcript-dapter.ts'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository.ts'
import type { AddAccount } from '../../../../domain/usecases/add-account.ts'
import { DbAddAccount } from '../../../../data/usercases/add-account/db-add-account.ts'

export const makeDbAddAccountFactory = (): AddAccount => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    return new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository)
}
