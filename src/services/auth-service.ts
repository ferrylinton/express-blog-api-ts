import bcrypt from 'bcrypt';
import { Request } from "express";
import { uid } from 'uid';
import { ClientData } from '../types/client-data-type';
import { AuthenticateType } from '../validations/authenticate-schema';
import * as redisService from './redis-service';
import * as userService from './user-service';
import { AuthError } from '../errors/auth-error';
import { logger } from "../configs/winston";


export const authenticate = async ({ username, password }: AuthenticateType) => {
    const user = await userService.findByUsername(username);

    if (user) {
        if (bcrypt.compareSync(password, user.password)) {
            if (user.locked) {
                throw new AuthError('User is locked');
            } else if (!user.activated) {
                throw new AuthError('User is not activated');
            } else if (user.loginAttempt >= 3) {
                throw new AuthError('Too many failed login');
            }

            userService.updateLoginInfo({ username: user.username, loginAttempt: 0 })
                .catch(error => logger.error(error.message));

            return user;
        } else {
            userService.updateLoginInfo({ username: user.username, loginAttempt: user.loginAttempt + 1 })
                .catch(error => logger.error(error.message));
        }
    }

    return null;
}

export const generateToken = async ({ username, authorities }: User, client: ClientData) => {
    const now = new Date();
    const token = uid(32) + '-' + now.getTime();
    const clientData = { username, authorities, ...client };
    const ttl = await redisService.saveToken(username, token, JSON.stringify(clientData));

    if (ttl) {
        return { token, ttl, ...clientData };
    } else {
        return null;
    }
}

export const deleteToken = async (token: string) => {
    return await redisService.deleteToken(token);
}

export const getAuthData = async (token: string) => {
    return await redisService.getAuthData(token);
}

export const getAllTokens = async (username: string) => {
    return await redisService.getAllTokens(username);
}

export const getTokenFromRequest = (req: Request) => {
    if (req.header('x-access-token')) {
        return req.header('x-access-token') as string;
    } else if (req.query && req.query.token) {
        return req.query.token as string;
    }

    return null;
}

export const deleteTokenByUsername = async (username: string) => {
    return await redisService.deleteTokenByUsername(username);
}