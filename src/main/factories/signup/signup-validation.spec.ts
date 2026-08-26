import { makeSignUpValidation } from './signup-validation.ts'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite.ts'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation.ts'
import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compare-fields-validation.ts'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation.ts'
import type { EmailValidator } from '../../../presentation/protocols/email-validator.ts'

jest.mock('../../../presentation/helpers/validators/validation-composite.ts')

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

describe('SignUpValidationFactory', () => {
    it('Should call ValidationComposite with all validations', () => {
        makeSignUpValidation()
        const validations = []
        for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
            validations.push(new RequiredFieldValidation(field))
        }
        validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
        validations.push(new EmailValidation('email', makeEmailValidator()))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})
