import { NextFunction, Request, Response } from 'express';
import requestIp from 'request-ip';


export const clientInfoHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hostIp = req.ip;
        const clientIp = requestIp.getClientIp(req) || '';
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

