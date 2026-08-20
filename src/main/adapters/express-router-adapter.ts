import type { HttpRequest } from '../../presentation/protocols/http.ts'
import type { Controller } from '../../presentation/protocols/controller.ts'
import type { Request, Response } from 'express'

export const adaptRoute = (controller: Controller) => async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
        body: req.body as HttpRequest,
    }
    const httpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
        res.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
        res.status(httpResponse.statusCode).json({
            error: (httpResponse.body as Error).message,
        })
    }
}
