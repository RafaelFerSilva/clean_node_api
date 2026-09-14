import {
    ValidationComposite,
    RequiredFieldValidation,
    CompareFieldsValidation,
    EmailValidation,
} from '../../../presentation/helpers/validators/index.ts'
import type { Validation } from '../../../presentation/protocols/validation.ts'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter.ts'

export const makeSignUpValidation = (): ValidationComposite => {
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
        validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    return new ValidationComposite(validations)
}
