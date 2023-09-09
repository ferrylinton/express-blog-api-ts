import { createClient } from 'redis';
import { REDIS_SOCKET_PATH, REDIS_URL } from './env-constant';
import { logger } from './winston';

const redisClient = createClient(REDIS_SOCKET_PATH ?
    {
        socket: { path: REDIS_SOCKET_PATH }
    } :
    {
        url: REDIS_URL
    }
);


redisClient.on("connect", () => {
    logger.info(`[REDIS] connection established`);
});

redisClient.on("error", (error) => {
    logger.error(error)
});

export default redisClient;