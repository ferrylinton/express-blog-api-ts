import { NextFunction, Request, Response } from 'express';
import * as authService from '../services/auth-service';
import * as redisService from '../services/redis-service';
import { AuthData } from '../types/auth-data-type';

const PUBLIC_API_ALL_METHOD = ['/', '/auth/token']
const PUBLIC_API_GET_METHOD = ['/api/images', '/api/posts', '/api/tags']

export const authHandler = async (req: Request, res: Response, next: NextFunction) => {
    
    if (PUBLIC_API_ALL_METHOD.indexOf(req.path) === 1 ||
        (req.method === 'GET' && checkIfStringStartsWith(req.path, PUBLIC_API_GET_METHOD))) {

        // Public API
        next();

    } else {
        const token = authService.getTokenFromRequest(req);

        if (token) {
            try {
                const authDataString = await redisService.findToken(token);

                if (authDataString) {
                    const authData: AuthData = JSON.parse(authDataString as string);
                    if (authData.username) {
                        req.auth = authData;
                        next();
                    } else {
                        return res.status(401).json({ message: "Invalid token" });
                    }

                } else {
                    return res.status(401).json({ message: "Invalid token" });
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