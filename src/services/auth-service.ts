import bcrypt from 'bcrypt';
import { Request } from "express";
import { uid } from 'uid';
import { ClientData } from '../types/client-data-type';
import { AuthenticateType } from '../validations/authenticate-schema';
import * as redisService from './redis-service';
import * as userService from './user-service';


export const authenticate = async ({ username, password }: AuthenticateType) => {
    const user = await userService.findByUsername(username);

    if (user && bcrypt.compareSync(password, user.password)) {
        return user;
    }

    return null;
}

export const generateToken = async ({ username, authorities }: User, client: ClientData) => {
    const now = new Date();
    const token = uid(32)+ '-' + now.getTime();
    const clientData = { username, authorities, ...client };
    const ttl = await redisService.saveToken(username, token, JSON.stringify(clientData));
    
    if(ttl){
        return { token, ttl, ...clientData };
    }else{
        return null;
    }
}

export const deleteToken = async(token: string) => {
    return await redisService.deleteToken(token);
}

export const getAuthData = async(token: string) => {
    return await redisService.getAuthData(token);
}

export const getAllTokens = async(username: string) => {
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