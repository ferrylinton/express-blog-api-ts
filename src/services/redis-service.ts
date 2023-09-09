import { REDIS_PREFIX } from "../configs/env-constant";
import redisClient from "../configs/redis";

const EX = 86400; // 24 jam

export const isUserSignin = async (username: string) => {
    const keys = await redisClient.KEYS(`${REDIS_PREFIX}:${username}`);
    return keys.length > 0;
}

export const findToken = async (token: string) => {
    return await redisClient.GET(`${REDIS_PREFIX}:${token}`);
}

export const saveToken = async (username: string, token: String, authData: string) => {
    await deleteTokenByUsername(username);
    const [result1, result2] = await redisClient
        .multi()
        .SET(`${REDIS_PREFIX}:${username}`, `${token}`, { EX, NX: true })
        .SET(`${REDIS_PREFIX}:${token}`, `${authData}`, { EX, NX: true })
        .exec();

    if (result1 === 'OK' && result2 === 'OK') {
        return token
    } else {
        return null;
    }
}

export const deleteToken = async (token: string) => {
    const username = await redisClient.GET(`${REDIS_PREFIX}:${token}`);
    const [result1, result2] = await redisClient
        .multi()
        .DEL(`${REDIS_PREFIX}:${username}`)
        .DEL(`${REDIS_PREFIX}:${token}`)
        .exec();

    if (result1 === 'OK' && result2 === 'OK') {
        return 'OK'
    } else {
        return null;
    }
}

export const deleteTokenByUsername = async (username: string) => {
    const token = await redisClient.GET(`${REDIS_PREFIX}:${username}`);
    const [result1, result2] = await redisClient
        .multi()
        .DEL(`${REDIS_PREFIX}:${username}`)
        .DEL(`${REDIS_PREFIX}:${token}`)
        .exec();

    if (result1 === 'OK' && result2 === 'OK') {
        return 'OK'
    } else {
        return null;
    }
}