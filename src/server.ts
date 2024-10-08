import { address } from 'ip';
import app from './app';
import { PORT } from './configs/env-constant';
import { logger } from './configs/winston';
import { reload as reloadWhitelist } from './services/whitelist-service';


const callback = () => {
  logger.info(`[SERVER] Server is running at 'http://${address()}:${PORT}'`);
};

(async () => {

  try {
    await reloadWhitelist();
    app.listen(parseInt(PORT), "0.0.0.0", callback);
  } catch (error) {
    console.error(error);
    logger.error(error);
  }

})()


