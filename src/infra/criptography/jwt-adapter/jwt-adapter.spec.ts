import { JwtAdapter } from './jwt-adapter.ts'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('any_token'),
}))

describe('JwtAdapter', () => {
    it('should call sign with correct values', async () => {
        const sut = new JwtAdapter('secret')
        const signSpy = jest.spyOn(jwt, 'sign')
        await sut.encrypt('any_id')
        expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    it('should return a token on sign success', async () => {
        const sut = new JwtAdapter('secret')
        const token = await sut.encrypt('any_id')
        expect(token).toBe('any_token')
    })

    it('should throw if sign throws', async () => {
        const sut = new JwtAdapter('secret')
        const signSpy = jest.spyOn(jwt, 'sign')
        signSpy.mockImplementationOnce(() => {
            throw new Error('any_error')
        })
        await expect(sut.encrypt('any_id')).rejects.toThrow('any_error')
    })
})
