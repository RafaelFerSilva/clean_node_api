import type {
    Autentication,
    AutenticationParams,
    AutenticationModel,
} from '../../../domain/usecases/autentication.js'
import type { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository.ts'

export class DBAutenticationUseCase implements Autentication {
    constructor(private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}

    async auth(autenticationParams: AutenticationParams): Promise<AutenticationModel | null> {
        await this.loadAccountByEmailRepository.loadByEmail(autenticationParams.email)
        return null
    }
}
