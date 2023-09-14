import { logger } from '../../configs/winston';
import { initAuthorityData } from "./authority-data";
import { initWhitelistData } from "./whitelist-data";


(async () => {
    logger.info('[MONGODB] init data');

    await initWhitelistData();
    await initAuthorityData();

    setTimeout(function () {
        process.exit();
    }, 2000);
})()