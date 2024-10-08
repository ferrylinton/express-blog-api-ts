import { join } from 'path';
import { logger } from '../src/configs/winston';
import { initAuthorityData } from "./datas/authority-data";
import { initUserData } from './datas/user-data';
import { initWhitelistData } from "./datas/whitelist-data";
import { getAllFiles } from './file-util';
import { MARKDOWN_FOLDER } from '../src/configs/env-constant';



(async () => {
    logger.info('[MONGODB] init data');

    try {
        await initWhitelistData();
        await initAuthorityData();
        await initUserData();

    } catch (error: any) {
        console.log(error);
    } finally {
        setTimeout(function () {
            process.exit();
        }, 5000);
    }
})()