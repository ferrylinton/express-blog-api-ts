import { NextFunction, Request, Response } from 'express';
import * as authService from '../services/auth-service';
import * as redisService from '../services/redis-service';
import { AuthenticateSchema } from '../validations/authenticate-schema';


export async function generateToken(req: Request, res: Response, next: NextFunction) {
    try {
        const validation = AuthenticateSchema.safeParse(req.body);

        if (validation.success) {
            const user = await authService.authenticate(validation.data);

            if (user) {
                const result = await authService.generateToken(user, req.client);
                return res.status(200).json(result);
            }
        }

        res.status(401).json({ message: "Invalid username or password" });
    } catch (error) {
        next(error);
    }
};

export async function revokeToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = authService.getTokenFromRequest(req) as string;
        await redisService.deleteToken(token);
        res.status(200).json({ message: 'Token is revoked' });
    } catch (error) {
        next(error);
    }
};
