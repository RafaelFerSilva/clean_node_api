import type {
    Autentication,
    AutenticationParams,
    AutenticationModel,
} from '../../../domain/usecases/autentication.js'
import type { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository.js'

export class DBAutenticationUseCase implements Autentication {
    constructor(private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}

    async auth(autenticationParams: AutenticationParams): Promise<AutenticationModel> {
        const account = await this.loadAccountByEmailRepository.loadByEmail(
            autenticationParams.email,
        )
        if (!account) {
            throw new Error('Invalid credentials')
        }
        return { accessToken: 'valid_token' }
    }
}
