import { makeSignUpValidation } from './signup-validation.ts'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite.ts'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation.ts'
import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation.ts'

jest.mock('../../presentation/helpers/validators/validation-composite.ts')

describe('SignUpValidationFactory', () => {
    it('Should call ValidationComposite with all validations', () => {
        makeSignUpValidation()
        const validations = []
        for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
            validations.push(new RequiredFieldValidation(field))
        }
        validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})
