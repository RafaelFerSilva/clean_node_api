import type { AccountModel } from '../../../../domain/models/account.ts'
import type { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository.ts'
import type { AddAccountModel } from '../../../../domain/usecases/add-account.ts'
import { MongoHelper } from '../helpers/mongo-helper.ts'

export class AccountMongoRepository implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const result = await accountCollection.insertOne(accountData)
        const account = await accountCollection.findOne({ _id: result.insertedId })
        if (!account) {
            throw new Error('Account not found')
        }
        return MongoHelper.map(account) as unknown as AccountModel
    }
}
