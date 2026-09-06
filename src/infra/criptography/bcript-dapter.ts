import type { Hasher } from '../../data/protocols/criptoghraphy/hasher.ts'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher {
    private readonly salt: number

    constructor(salt: number) {
        this.salt = salt
    }

    async hash(value: string): Promise<string> {
        return await bcrypt.hash(value, this.salt)
    }
}
