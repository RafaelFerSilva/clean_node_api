import { InvalidParamError } from '../../errors/invalid-param-error.ts'
import type { Validation } from '../../protocols/validation.ts'

export class CompareFieldsValidation implements Validation {
    constructor(
        private readonly fieldName: string,
        private readonly fieldToCompareName: string,
    ) {}

    validate(input: unknown): Error | null {
        const field = input as Record<string, unknown>

        if (field[this.fieldName] !== field[this.fieldToCompareName])
            return new InvalidParamError(this.fieldName)

        return null
    }
}
