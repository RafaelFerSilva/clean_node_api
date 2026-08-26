import { ValidationComposite } from './validation-composite.ts'
import type { Validation } from '../../protocols/validation.ts'

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: unknown): Error | null {
            return null
        }
    }
    return new ValidationStub()
}

interface SutTypes {
    sut: ValidationComposite
    validationStubs: Validation[]
}

const makeSut = (): SutTypes => {
    const validationStubs = [makeValidation(), makeValidation()]
    const sut = new ValidationComposite(validationStubs)
    return { sut, validationStubs }
}

describe('Validation Composite', () => {
    test('Should return null if validation returns null', () => {
        const { sut } = makeSut()
        const error = sut.validate({})
        expect(error).toBeNull()
    })

    test('Should return the first error if any validation returns an error', () => {
        const { sut, validationStubs } = makeSut()
        const error = new Error('Invalid param')
        jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(error)
        const errorResult = sut.validate({})
        expect(errorResult).toEqual(error)
    })
})
