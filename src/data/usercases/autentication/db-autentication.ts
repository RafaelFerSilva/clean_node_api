import type {
    Autentication,
    AutenticationParams,
    AutenticationModel,
} from '../../../domain/usecases/autentication.js'
import type { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository.ts'
import type { HashComparer } from '../../protocols/criptoghraphy/has-comparer.ts'

export class DBAutenticationUseCase implements Autentication {
    constructor(
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hashComparer: HashComparer,
    ) {}

    async auth(autenticationParams: AutenticationParams): Promise<AutenticationModel | null> {
        const account = await this.loadAccountByEmailRepository.loadByEmail(
            autenticationParams.email,
        )
        if (account) {
            const isValid = await this.hashComparer.compare(
                autenticationParams.password,
                account.password,
            )
            if (isValid) {
                return null
            }
        }
        return null
    }
}
