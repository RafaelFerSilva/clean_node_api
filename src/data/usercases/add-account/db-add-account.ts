import type {
    Encrypter,
    AddAccount,
    AddAccountModel,
    AccountModel,
} from './db-add-account-protocols.ts'

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
