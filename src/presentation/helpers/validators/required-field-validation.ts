import { MissingParamError } from '../../errors/missing-param-error.ts'
import type { Validation } from '../../protocols/validation.ts'

export class RequiredFieldValidation implements Validation {
    constructor(private readonly fieldName: string) {}

    validate(input: unknown): Error | null {
        if (!(input as Record<string, unknown>)[this.fieldName]) {
            return new MissingParamError(this.fieldName)
        }

        return null
    }
}
