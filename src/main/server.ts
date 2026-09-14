import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper.ts'
import env from './config/env.ts'

void MongoHelper.connect(env.mongoUrl)
    .then(async () => {
        const { default: app } = await import('./config/app.ts')
        app.listen(env.port, () => {
            console.log(`Server running at http://localhost:${env.port}`)
        })
    })
    .catch((error: unknown) => {
        console.error('Failed to connect to MongoDB:', error)
        process.exit(1)
    })
