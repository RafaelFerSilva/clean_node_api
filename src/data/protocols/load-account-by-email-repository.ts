import type { AccountModel } from '../../domain/models/account.js'

export interface LoadAccountByEmailRepository {
    loadByEmail: (email: string) => Promise<AccountModel | null>
}
