import type { Request, Response, NextFunction } from 'express'

export const cors = (_req: Request, res: Response, next: NextFunction): void => {
    res.header('access-control-allow-origin', '*')
    res.header('access-control-allow-methods', '*')
    res.header('access-control-allow-headers', '*')
    next()
}
