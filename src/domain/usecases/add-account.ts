import type { AccountModel } from '../models/account.ts'

export interface AddAccountModel {
    name: string
    email: string
    password: string
}

export interface AddAccount {
    add: (account: AddAccountModel) => AccountModel
}
