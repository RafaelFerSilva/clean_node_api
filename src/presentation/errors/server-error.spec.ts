import { ServerError } from './server-error.ts'

describe('ServerError', () => {
    test('should construct with correct properties when stack is provided', () => {
        const sut = new ServerError('any_stack')
        expect(sut.name).toBe('ServerError')
        expect(sut.message).toBe('Internal server error')
        expect(sut.stack).toBe('any_stack')
    })

    test('should construct with correct properties when stack is undefined', () => {
        const sut = new ServerError(undefined)
        expect(sut.stack).toBe('')
    })
})
