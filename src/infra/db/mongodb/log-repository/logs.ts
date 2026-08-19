import type { LogErrorRepository } from '../../../../data/protocols/log-error-repository.ts'
import { MongoHelper } from '../helpers/mongo-helper.ts'

export class LogMongoRepository implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
        const errorsCollection = await MongoHelper.getCollection('errors')
        await errorsCollection.insertOne({
            stack,
            date: new Date(),
        })
    }
}
