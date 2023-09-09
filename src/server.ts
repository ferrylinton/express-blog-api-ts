import { address } from 'ip';
import app from './app';
import { PORT } from './configs/env-constant';
import redisClient from './configs/redis';
import { logger } from './configs/winston';

const callback = () => {
  logger.info(`[SERVER] Server is running at 'http://${address()}:${PORT}'`);
};

(async () => {

  try {
    await redisClient.connect();
    app.listen(parseInt(PORT), "0.0.0.0", callback);
  } catch (error) {
    logger.error(error);
    process.exit();
  }

})()


