import type { EmailValidator } from '../presentation/protocols/email-validator.js'

export class EmailValidatorAdapter implements EmailValidator {
    isValid(email: string): boolean {
        return false
    }
}
