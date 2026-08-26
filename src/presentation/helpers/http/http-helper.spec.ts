import { serverError } from './http-helper.ts'
import { ServerError } from '../../errors/index.ts'

describe('Http Helper', () => {
    test('serverError should return ServerError with empty stack if error stack is undefined', () => {
        const error = new Error()
        error.stack = undefined
        const httpResponse = serverError(error)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError(''))
    })
})
