import { JwtAdapter } from './jwt-adapter.ts'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtAdapter', () => {
    it('should return a token on sign success', async () => {
        const sut = new JwtAdapter('secret')
        const signSpy = jest.spyOn(jwt, 'sign')
        await sut.encrypt('any_id')
        expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })
})
