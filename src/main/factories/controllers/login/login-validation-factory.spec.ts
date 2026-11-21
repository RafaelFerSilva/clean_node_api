import { makeLoginValidation } from './login-validation-factory.ts'

import type { EmailValidator } from '../../../../validation/protocols/email-validator.ts'
import { EmailValidation } from '../../../../validation/validators/email-validation.ts'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation.ts'
import { ValidationComposite } from '../../../../validation/validators/validation-composite.ts'

jest.mock('../../../../validation/validators/validation-composite.ts')

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

describe('LoginValidationFactory', () => {
    it('Should call ValidationComposite with all validations', () => {
        makeLoginValidation()
        const validations = []
        for (const field of ['email', 'password']) {
            validations.push(new RequiredFieldValidation(field))
        }
        validations.push(new EmailValidation('email', makeEmailValidator()))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})
