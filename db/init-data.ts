import { logger } from '../src/configs/winston';
import { initAuthorityData } from "./datas/authority-data";
import { initImageData } from './datas/image-data';
import { initPostData } from './datas/post-data';
import { initTagData } from './datas/tag-data';
import { initUserData } from './datas/user-data';
import { initWhitelistData } from "./datas/whitelist-data";


(async () => {
    logger.info('[MONGODB] init data');

    try {
        await initImageData();
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
        }, 5000);
    }
})()