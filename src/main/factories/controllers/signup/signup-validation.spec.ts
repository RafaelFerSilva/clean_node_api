import { makeSignUpValidation } from './signup-validation-factory.ts'
import {
    ValidationComposite,
    RequiredFieldValidation,
    EmailValidation,
    CompareFieldsValidation,
} from '../../../../validation/validators/index.ts'
import type { EmailValidator } from '../../../../validation/protocols/email-validator.ts'

jest.mock('../../../../validation/validators/validation-composite.ts')

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
