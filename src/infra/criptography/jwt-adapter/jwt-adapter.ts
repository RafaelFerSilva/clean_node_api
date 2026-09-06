import type { Encrypter } from '../../../data/protocols/criptoghraphy/encrypter.ts'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter {
    private readonly secret: string

    constructor(secret: string) {
        this.secret = secret
    }

    async encrypt(value: string): Promise<string> {
        return await Promise.resolve(jwt.sign({ id: value }, this.secret))
    }
}
