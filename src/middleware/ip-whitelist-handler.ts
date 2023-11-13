import { NextFunction, Request, Response } from 'express';
import { getWhitelist } from '../services/whitelist-service';
import { logger } from "../configs/winston";

const message = "Access Restricted";

export const ipWhitelistHandler = async (req: Request, res: Response, next: NextFunction) => {
    const hostIp = req.header("x-forwarded-for") || '';
    const clientIp = req.header("x-client-ip") || hostIp || '';
    if ((await getWhitelist()).has(hostIp)) {
        logger.log({
            request: true,
            level: 'debug',
            message: `[REQUEST] ${JSON.stringify({
                hostIp,
                clientIp,
                method: req.method,
                url: req.url
            })}`
        });

        next();

    } else {

        logger.log({
            request: true,
            level: 'debug',
            message: `[REQUEST] ${JSON.stringify({
                hostIp,
                clientIp,
                method: req.method,
                url: req.url,
                message
            })}`
        });

        return res.status(403).json({ message });
    }
};