import { RedisStore } from 'rate-limit-redis';
import { rateLimit } from 'express-rate-limit';
import redisClient from '../configs/redis';
import { RATE_LIMIT_DURATION, RATE_LIMIT_MAX } from '../configs/env-constant';


export const rateLimitHandler = rateLimit({
    windowMs: RATE_LIMIT_DURATION,
    limit: RATE_LIMIT_MAX,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later." },
    keyGenerator: (req, res) => {
        return req.client.clientIp || req.ip
    },
    store: new RedisStore({
        sendCommand: async (...args: string[]) => {

            if (!redisClient.isOpen) {
                await redisClient.connect();
            }

            return redisClient.sendCommand(args)
        }
    }),
})