import { InvalidParamError } from '../../errors/invalid-param-error.ts'
import { CompareFieldsValidation } from './compare-fields-validation.ts'

describe('Compare Fields Validation', () => {
    test('Should return InvalidParamError if field is not equal to fieldToCompare', () => {
        const sut = new CompareFieldsValidation('field', 'fieldToCompare')
        const error = sut.validate({ field: 'any_value', fieldToCompare: 'other_value' })
        expect(error).toEqual(new InvalidParamError('field'))
    })

    test('Should return null if field is equal to fieldToCompare', () => {
        const sut = new CompareFieldsValidation('field', 'fieldToCompare')
        const error = sut.validate({ field: 'any_value', fieldToCompare: 'any_value' })
        expect(error).toBeNull()
    })
})
