import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller.ts'
import type { Controller } from '../../../../presentation/controllers/signup/signup-controller-protocols.ts'
import { makeSignUpValidation } from './signup-validation-factory.ts'
import { makeDbAutenticationFactory } from '../../usecase/autentication/db-autentication-factory.ts'
import { makeDbAddAccountFactory } from '../../usecase/add-account/db-add-account.ts'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory.ts'

export const makeSignUpController = (): Controller => {
    const controller = new SignUpController(
        makeDbAddAccountFactory(),
        makeSignUpValidation(),
        makeDbAutenticationFactory(),
    )

    return makeLogControllerDecorator(controller)
}
