import type { Controller } from '../../../../presentation/controllers/signup/signup-controller-protocols.ts'
import { makeLoginValidation } from './login-validation-factory.ts'
import { LoginController } from '../../../../presentation/controllers/login/login-controller.ts'
import { makeDbAutenticationFactory } from '../../usecase/autentication/db-autentication-factory.ts'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory.ts'

export const makeLoginController = (): Controller =>
    makeLogControllerDecorator(
        new LoginController(makeDbAutenticationFactory(), makeLoginValidation()),
    )
