import { NextFunction, Request, Response } from 'express';
import requestIp from 'request-ip';
import parser from 'ua-parser-js';


export const clientInfoHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ip = requestIp.getClientIp(req);
        const { browser, os } = parser(req.headers['user-agent']);
        req.client = {
            ip: ip || '',
            browser: browser?.name || '',
            os: os?.name || ''
        }

    } catch (error) {
        console.error(error);
    }

    next();
}

