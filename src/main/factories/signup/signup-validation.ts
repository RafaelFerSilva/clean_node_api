import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite.ts'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation.ts'
import type { Validation } from '../../../presentation/protocols/validation.ts'
import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compare-fields-validation.ts'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation.ts'
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
