import { logger } from '../../configs/winston';
import { initAuthorityData } from "./authority-data";
import { initPostData } from './post-data';
import { initTagData } from './tag-data';
import { initUserData } from './user-data';
import { initWhitelistData } from "./whitelist-data";


(async () => {
    logger.info('[MONGODB] init data');

    try {

        await initWhitelistData();
        await initAuthorityData();
        await initUserData();
        await initTagData();
        await initPostData();

    } catch (error: any) {
        console.log(error);
    } finally {
        setTimeout(function () {
            process.exit();
        }, 2000);
    }
})()