import type { AccountModel } from '../../domain/models/account.ts'
import type { AddAccountModel } from '../../domain/usecases/add-account.ts'

export interface AddAccountRepository {
    add: (accountData: AddAccountModel) => Promise<AccountModel>
}
