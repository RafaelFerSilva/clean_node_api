import type { AccountModel } from '../../../../domain/models/account.ts'
import type { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository.ts'
import type { AddAccountModel } from '../../../../domain/usecases/add-account.ts'
import { MongoHelper } from '../helpers/mongo-helper.ts'
import type { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository.ts'
import type { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository.ts'
import { ObjectId } from 'mongodb'

export class AccountMongoRepository
    implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository
{
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const result = await accountCollection.insertOne(accountData)
        const account = await accountCollection.findOne({ _id: result.insertedId })
        if (!account) {
            throw new Error('Account not found')
        }
        return MongoHelper.map(account) as unknown as AccountModel
    }

    async loadByEmail(email: string): Promise<AccountModel | null> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const account = await accountCollection.findOne({ email })
        return account && (MongoHelper.map(account) as unknown as AccountModel)
    }

    async updateAccessToken(id: string, token: string): Promise<void> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    accessToken: token,
                },
            },
        )
    }
}
