import { InvalidParamError } from '../../errors/invalid-param-error.ts'
import type { EmailValidator } from '../../protocols/email-validator.ts'
import type { Validation } from '../../protocols/validation.ts'

export class EmailValidation implements Validation {
    constructor(
        private readonly fieldName: string,
        private readonly emailValidator: EmailValidator,
    ) {}

    validate(input: unknown): Error | null {
        const email = (input as Record<string, unknown>)[this.fieldName] as string

        if (!this.emailValidator.isValid(email)) {
            return new InvalidParamError(this.fieldName)
        }

        return null
    }
}
