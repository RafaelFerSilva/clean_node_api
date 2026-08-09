import type { HttpResponse, HttpRequest } from './http.ts'

export interface Controller {
    handle: (httpRequest: HttpRequest) => HttpResponse
}
