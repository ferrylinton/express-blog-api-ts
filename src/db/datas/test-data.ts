import { initAuthorityData } from "./authority-data";
import { initImageData } from "./image-data";
import { initPostData } from "./post-data";
import { initTagData } from "./tag-data";
import { initUserData } from "./user-data";
import { initWhitelistData } from "./whitelist-data";

(async () => {
    console.log('[MONGODB] test data');

    try {

        await initImageData();

    } catch (error: any) {
        console.log(error);
    }finally{
        setTimeout(function () {
            process.exit();
        }, 2000);
    }

})()