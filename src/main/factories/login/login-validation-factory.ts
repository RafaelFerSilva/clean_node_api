import {
    ValidationComposite,
    RequiredFieldValidation,
    EmailValidation,
} from '../../../presentation/helpers/validators/index.ts'
import type { Validation } from '../../../presentation/protocols/validation.ts'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter.ts'

export const makeLoginValidation = (): ValidationComposite => {
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
        validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    return new ValidationComposite(validations)
}
