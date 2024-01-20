import { RedisStore } from 'rate-limit-redis';
import { rateLimit } from 'express-rate-limit';
import redisClient from '../configs/redis';
import { RATE_LIMIT_DURATION, RATE_LIMIT_MAX } from '../configs/env-constant';


export const rateLimitHandler =  rateLimit({
    windowMs: RATE_LIMIT_DURATION, // 15 minutes
    limit: RATE_LIMIT_MAX, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: { message: "Too many requests, please try again later." },
    store: new RedisStore({
        sendCommand: async (...args: string[]) => {

            if(!redisClient.isOpen){
                await redisClient.connect();
            }

            return redisClient.sendCommand(args)
        }
    }),
})