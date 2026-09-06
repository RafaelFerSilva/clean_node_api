import type {
    Autentication,
    AutenticationParams,
    AutenticationModel,
    LoadAccountByEmailRepository,
    HashComparer,
    Encrypter,
    UpdateAccessTokenRepository,
} from './db-autentication.protocols.ts'

export class DBAutenticationUseCase implements Autentication {
    constructor(
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hashComparer: HashComparer,
        private readonly encrypter: Encrypter,
        private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
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
                const accessToken = await this.encrypter.encrypt(account.id)
                await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
                return { accessToken }
            }
        }
        return null
    }
}
