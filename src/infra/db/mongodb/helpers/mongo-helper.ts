import { type Collection, type Document, MongoClient, type WithId } from 'mongodb'

export const MongoHelper = {
    client: null as MongoClient | null,
    url: null as string | null,

    async connect(uri: string): Promise<void> {
        this.client = await MongoClient.connect(uri)
        this.url = uri
    },

    async disconnect(): Promise<void> {
        await this.client?.close()
        this.client = null
        this.url = null
    },

    getCollection(collectionName: string): Collection {
        if (!this.client) {
            throw new Error('Mongo client is not connected')
        }
        return this.client.db().collection(collectionName)
    },

    map<T extends Document>(data: WithId<T>): Omit<T, '_id'> & { id: string } {
        const { _id, ...rest } = data
        return {
            ...rest,
            id: _id.toString(),
        } as unknown as Omit<T, '_id'> & { id: string }
    },
}
