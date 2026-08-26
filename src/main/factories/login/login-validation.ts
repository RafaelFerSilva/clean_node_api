import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite.ts'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation.ts'
import type { Validation } from '../../../presentation/helpers/validators/validation.ts'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation.ts'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter.ts'

export const makeLoginValidation = (): ValidationComposite => {
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
        validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    return new ValidationComposite(validations)
}
