import type { Controller } from '../../../presentation/controllers/signup/signup-controller-protocols.ts'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/logs-mongo-repository.ts'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator.ts'

export const makeLogControllerDecorator = (controller: Controller): Controller => {
    const logMongoRepository = new LogMongoRepository()
    return new LogControllerDecorator(controller, logMongoRepository)
}
