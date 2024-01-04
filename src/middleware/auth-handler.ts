import { NextFunction, Request, Response } from 'express';
import * as authService from '../services/auth-service';
import * as redisService from '../services/redis-service';

const PUBLIC_API_ALL_METHOD = ['/', '/auth/token']
const PUBLIC_API_GET_METHOD = ['/api/images', '/api/posts', '/api/tags', '/api/sitemaps']

export const authHandler = async (req: Request, res: Response, next: NextFunction) => {
    if (PUBLIC_API_ALL_METHOD.includes(req.path) ||
        (req.method === 'GET' && checkIfStringStartsWith(req.path, PUBLIC_API_GET_METHOD))) {
        // Public API, no authentication
        next();
    } else {
        const token = authService.getTokenFromRequest(req);

        if (token) {
            try {

                const authData = await redisService.getAuthData(token);

                if (authData) {
                    if (req.client.clientIp !== authData.clientIp) {
                        return res.status(401).json({ message: "Invalid token, wrong client ip" });
                    }

                    if (req.client.userAgent !== authData.userAgent) {
                        return res.status(401).json({ message: "Invalid token, wrong user agent" });
                    }

                    req.auth = authData;
                    next();
                } else {
                    return res.status(401).json({ message: "Invalid token, token is not found" });
                }
            } catch (err: any) {
                return res.status(401).json({
                    message: err.message
                });
            }


        } else {
            return res.status(401).json({ message: "Token is required" });
        }
    }
};

const checkIfStringStartsWith = (str: string, substrs: string[]) => {
    return substrs.some(substr => str.toLowerCase().startsWith(substr.toLowerCase()));
}