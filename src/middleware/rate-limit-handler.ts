import { RedisStore } from 'rate-limit-redis';
import { rateLimit } from 'express-rate-limit';
import redisClient from '../configs/redis';


export const rateLimitHandler = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: { message: "Too many requests, please try again later." },
    store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
})