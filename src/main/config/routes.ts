import { type Express, Router } from 'express'
import fg from 'fast-glob'

export default (app: Express): void => {
    const router = Router()
    app.use('/api', router)
    void Promise.all(
        fg.sync('**/src/main/routes/**routes.ts').map(async (file) => {
            const route = (await import(`../../../${file}`)) as {
                default: (router: Router) => void
            }
            route.default(router)
        }),
    )
}
