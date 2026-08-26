import { MissingParamError } from '../../errors/index.ts'
import { RequiredFieldValidation } from './required-field-validation.ts'

describe('Required Field Validation', () => {
    test('Should return MissingParamError if field is not present', () => {
        const sut = new RequiredFieldValidation('any_field')
        const error = sut.validate({})
        expect(error).toEqual(new MissingParamError('any_field'))
    })

    test('Should return null if field is present', () => {
        const sut = new RequiredFieldValidation('any_field')
        const error = sut.validate({ any_field: 'any_value' })
        expect(error).toBeNull()
    })
})
