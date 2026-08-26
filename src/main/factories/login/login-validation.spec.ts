import { makeLoginValidation } from './login-validation.ts'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite.ts'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation.ts'
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
