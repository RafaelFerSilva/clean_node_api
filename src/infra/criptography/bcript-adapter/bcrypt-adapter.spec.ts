import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcript-dapter.ts'

jest.mock('bcrypt', () => ({
    hash: jest.fn().mockReturnValue(Promise.resolve('any_hash')),
    compare: jest.fn().mockReturnValue(Promise.resolve(true)),
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
    test('Should call hash with correct values', async () => {
        const { salt, sut } = makeSut()
        await sut.hash('any_value')
        expect(bcrypt.hash).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should return a valid hash on hash success', async () => {
        const { sut } = makeSut()
        const hash = await sut.hash('any_value')
        expect(hash).toBe('any_hash')
    })

    test('Should throw if bcrypt throws', async () => {
        const { sut } = makeSut()
        ;(jest.spyOn(bcrypt, 'hash') as jest.Mock).mockReturnValueOnce(Promise.reject(new Error()))
        await expect(sut.hash('any_value')).rejects.toThrow()
    })

    test('Should call compare with correct values', async () => {
        const { sut } = makeSut()
        const compareSpy = jest.spyOn(bcrypt, 'compare')
        await sut.compare('any_value', 'any_hash')
        expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    test('Should return true on compare success', async () => {
        const { sut } = makeSut()
        const isValid = await sut.compare('any_value', 'any_hash')
        expect(isValid).toBe(true)
    })

    test('Should return false on compare fails', async () => {
        const { sut } = makeSut()
        ;(jest.spyOn(bcrypt, 'compare') as jest.Mock).mockReturnValueOnce(Promise.resolve(false))
        const isValid = await sut.compare('any_value', 'any_hash')
        expect(isValid).toBe(false)
    })

    test('Should throw if bcrypt throws', async () => {
        const { sut } = makeSut()
        ;(jest.spyOn(bcrypt, 'compare') as jest.Mock).mockReturnValueOnce(
            Promise.reject(new Error()),
        )
        await expect(sut.compare('any_value', 'any_hash')).rejects.toThrow()
    })
})
