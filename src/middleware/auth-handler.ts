import { NextFunction, Request, Response } from 'express';
import * as authService from '../services/auth-service';
import * as redisService from '../services/redis-service';

const PUBLIC_API = ['/', '/auth/token']

export const authHandler = async (req: Request, res: Response, next: NextFunction) => {
    if (PUBLIC_API.indexOf(req.path) === -1) {
        const token = authService.getTokenFromRequest(req);

        if (token) {
            try {
                const authDataString = await redisService.findToken(token);
                
                if (authDataString) {
                    const authData : AuthData = JSON.parse(authDataString as string);
                    console.log(authData);
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
    } else {
        next();
    }
};