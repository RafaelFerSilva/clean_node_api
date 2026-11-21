import env from '../../../config/env.ts'
import { DBAutenticationUseCase } from '../../../../data/usercases/autentication/db-autentication.ts'
import { BcryptAdapter } from '../../../../infra/criptography/bcript-adapter/bcript-dapter.ts'
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter.ts'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository.ts'
import type { Autentication } from '../../../../domain/usecases/autentication.ts'

export const makeDbAutenticationFactory = (): Autentication => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    return new DBAutenticationUseCase(
        accountMongoRepository,
        bcryptAdapter,
        jwtAdapter,
        accountMongoRepository,
    )
}
