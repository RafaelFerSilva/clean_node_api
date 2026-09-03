import type {
    Autentication,
    AutenticationParams,
    AutenticationModel,
    LoadAccountByEmailRepository,
    HashComparer,
    TokenGenerator,
    UpdateAccessTokenRepository,
} from './db-autentication.protocols.ts'

export class DBAutenticationUseCase implements Autentication {
    constructor(
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hashComparer: HashComparer,
        private readonly tokenGenerator: TokenGenerator,
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
                const accessToken = await this.tokenGenerator.generate(account.id)
                await this.updateAccessTokenRepository.update(account.id, accessToken)
                return { accessToken }
            }
        }
        return null
    }
}
