import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite.ts'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation.ts'
import type { Validation } from '../../presentation/helpers/validators/validation.ts'

export const makeSignUpValidation = (): ValidationComposite => {
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
        validations.push(new RequiredFieldValidation(field))
    }
    return new ValidationComposite(validations)
}
