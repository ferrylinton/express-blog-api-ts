import { NextFunction, Request, Response } from 'express';


export const clientInfoHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hostIp = req.header("x-forwarded-for") || '';
        const clientIp = req.header("x-client-ip") || hostIp || '';
        const userAgent = req.headers['user-agent'];
        req.client = {
            hostIp,
            clientIp,
            userAgent
        }

    } catch (error) {
        console.error(error);
    }

    next();
}

