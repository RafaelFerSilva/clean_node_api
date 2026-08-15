import type { Encrypter } from '../../protocols/encrypter.ts'
import type { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account.ts'
import type { AccountModel } from '../../../domain/models/account.ts'

export class DbAddAccount implements AddAccount {
    private readonly encrypter: Encrypter

    constructor(encrypter: Encrypter) {
        this.encrypter = encrypter
    }

    async add(account: AddAccountModel): Promise<AccountModel> {
        await this.encrypter.encrypt(account.password)
        return null as unknown as AccountModel
    }
}
