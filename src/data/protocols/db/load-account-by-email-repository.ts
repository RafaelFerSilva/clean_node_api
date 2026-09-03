import type { AccountModel } from '../../../domain/models/account.ts'

export interface LoadAccountByEmailRepository {
    loadByEmail: (email: string) => Promise<AccountModel | null>
}
