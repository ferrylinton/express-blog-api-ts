import { REDIS_PREFIX } from "../configs/env-constant";
import redisClient from "../configs/redis";
import { AuthData } from "../types/auth-data-type";

const EX = 86400; // 24 jam

export const getAllTokens = async (username: string) => {
    const prefix = `${REDIS_PREFIX}:${username}:`;
    const keys = await redisClient.KEYS(`${REDIS_PREFIX}:${username}:*`);
    const tokens = keys.map(key => key.replace(prefix, ''));
    const authDatas = await redisClient.MGET(keys);
    return authDatas.map((authData, index) => {
        const { ip, browser, os } = JSON.parse(authData as string) as AuthData
        return { token: tokens[index], ip, browser, os }
    })
}

export const getAuthData = async (token: string) => {
    const username = await redisClient.GET(`${REDIS_PREFIX}:${token}`);

    if (username) {
        const key = `${REDIS_PREFIX}:${username}:${token}`;
        const [authData, ttl] = await redisClient
            .multi()
            .GET(key)
            .TTL(key)
            .exec();

        if (authData && ttl) {
            return { ttl, ...JSON.parse(authData as string) }
        }
    }

    return null;
}

export const saveToken = async (username: string, token: String, authData: string) => {
    const keys = await redisClient.KEYS(`${REDIS_PREFIX}:${username}:*`);

    // remove old token if keys length = 3 
    await removeOldToken(username,keys)

    const [result1, result2] = await redisClient
        .multi()
        .SET(`${REDIS_PREFIX}:${token}`, `${username}`, { EX, NX: true })
        .SET(`${REDIS_PREFIX}:${username}:${token}`, `${authData}`, { EX, NX: true })
        .exec();

    if (result1 === 'OK' && result2 === 'OK') {
        return EX
    } else {
        return null;
    }
}

export const deleteToken = async (token: string) => {
    const username = await redisClient.GET(`${REDIS_PREFIX}:${token}`);
    const [result1, result2] = await redisClient
        .multi()
        .DEL(`${REDIS_PREFIX}:${token}`)
        .DEL(`${REDIS_PREFIX}:${username}:${token}`)
        .exec();

    if (result1 === 'OK' && result2 === 'OK') {
        return 'OK'
    } else {
        return null;
    }
}

export const deleteByUsernameAndToken = async (username: string, token: string) => {
    const [result1, result2] = await redisClient
        .multi()
        .DEL(`${REDIS_PREFIX}:${token}`)
        .DEL(`${REDIS_PREFIX}:${username}:${token}`)
        .exec();

    if (result1 === 'OK' && result2 === 'OK') {
        return 'OK'
    } else {
        return null;
    }
}

export const getRemainingTTL = async (token: string) => {
    return await redisClient.TTL(`${REDIS_PREFIX}:${token}`);
}

const removeOldToken = async (username: string, keys: string[]) => {
    if (keys.length >= 3) {
        const numbers = keys.map(key => {
            const arr = key.split('-');
            if (arr.length === 2) {
                return arr[1]
            } else {
                const now = new Date();
                return now.getTime().toString();
            }
        })

        numbers.sort();

        for (let i = 0; i < keys.length; i++) {
            if (keys[i].includes(numbers[0])) {
                let tokenToRemove = keys[i].replace(`${REDIS_PREFIX}:${username}:`, '');
                await deleteByUsernameAndToken(username, tokenToRemove);
            }
        }
    }
}

export const deleteTokenByUsername = async (username: string) => {
    const tokens: string[] = [];
    const keys1 = await redisClient.KEYS(`${REDIS_PREFIX}:${username}:*`);
    const keys2 = keys1.map(key => {
        const token = key.replace(`${REDIS_PREFIX}:${username}:`, '');
        tokens.push(token);
        return `${REDIS_PREFIX}:${token}`;
    })

    const keys = [...keys1, keys2];

    for(let i=0; i<keys.length; i++){
        await redisClient.DEL(keys[i]);
    }

    return tokens;
}