import { POST_COLLECTION } from "../../configs/db-constant";
import { getCollection } from "../../configs/mongodb";
import { WithAudit } from "../../types/common-type";
import { Post } from "../../types/post-type";
import { initAuthorityData } from "./authority-data";
import { initImageData } from "./image-data";
import { initPostData } from "./post-data";
import { initTagData } from "./tag-data";
import { initUserData } from "./user-data";
import { initWhitelistData } from "./whitelist-data";

(async () => {
    console.log('[MONGODB] test data');

    try {

        const postCollection = await getCollection(POST_COLLECTION);
       // const result = await postCollection.createIndex( { "title.id": "text", "title.en": "text"} );
        //console.log(result);
        const result = postCollection.find({$text:{$search:"love"}});
        console.log(result);

    } catch (error: any) {
        console.log(error);
    }finally{
        setTimeout(function () {
            process.exit();
        }, 2000);
    }

})()