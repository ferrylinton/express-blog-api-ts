import { NextFunction, Request, Response } from 'express';
import * as authService from '../services/auth-service';
import { AuthenticateSchema } from '../validations/authenticate-schema';


export async function generateToken(req: Request, res: Response, next: NextFunction) {
    try {
        const validation = AuthenticateSchema.safeParse(req.body);

        if (validation.success) {
            const user = await authService.authenticate(validation.data);

            if (user) {
                const result = await authService.generateToken(user, req.client);

                if (result) {
                    return res.status(200).json(result);
                } else {
                    return res.status(401).json({ message: 'Can not generate token' });
                }
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
        await authService.deleteToken(token);
        res.status(200).json({ message: 'Token is revoked' });
    } catch (error) {
        next(error);
    }
};

export async function checkToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = authService.getTokenFromRequest(req) as string;
        const result = await authService.getAuthData(token);

        if (result) {
            res.status(200).json({ token, ...result });
        } else {
            res.status(401).json({ message: 'Invalid token' });
        }

    } catch (error) {
        next(error);
    }
};

export async function getAllTokens(req: Request, res: Response, next: NextFunction) {
    try {
        const tokens = await authService.getAllTokens(req.auth.username as string);
        res.status(200).json(tokens);
    } catch (error) {
        next(error);
    }
};

export async function revokeAllToken(req: Request, res: Response, next: NextFunction) {
    try {
        const tokens = await authService.deleteTokenByUsername(req.auth.username as string);
        res.status(200).json(tokens);
    } catch (error) {
        next(error);
    }
};
