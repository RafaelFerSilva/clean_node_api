import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcript-dapter.ts'

jest.mock('bcrypt', () => ({
    hash: jest.fn().mockReturnValue(Promise.resolve('any_hash')),
}))

interface SutTypes {
    salt: number
    sut: BcryptAdapter
}

const makeSut = (): SutTypes => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    return { salt, sut }
}

describe('BcryptAdapter', () => {
    test('Should call bcrypt with correct values', async () => {
        const { salt, sut } = makeSut()
        await sut.encrypt('any_value')
        expect(bcrypt.hash).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should return a hash on success', async () => {
        const { sut } = makeSut()
        const hash = await sut.encrypt('any_value')
        expect(hash).toBe('any_hash')
    })
})
