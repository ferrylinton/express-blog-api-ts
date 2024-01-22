import { NextFunction, Request, Response } from 'express';


export const clientInfoHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hostHeader = req.header("x-forwarded-host") || 'unknown';
        const hosts = hostHeader.split(",");
        const hostIp = hosts.length > 0 ? hosts[0] : 'unknown';

        const clientIp = req.header("x-client-ip") || req.header("x-real-ip") || req.header("x-forwarded-for") || req.ip || req.path;
        const userAgent = req.headers['user-agent'] || 'unknown';
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

