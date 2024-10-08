import { MONGODB_DATABASE } from "../src/configs/env-constant";
import { getMongoClient } from "../src/configs/mongodb";
import { AUTHORITY_COLLECTION } from "../src/configs/db-constant";
import { IMAGE_FILES_CHUNKS, IMAGE_FILES_COLLECTION } from "../src/configs/db-constant";
import { POST_COLLECTION } from "../src/configs/db-constant";
import { TAG_COLLECTION } from "../src/configs/db-constant";
import { TODO_COLLECTION } from "../src/configs/db-constant";
import { USER_COLLECTION } from "../src/configs/db-constant";
import { WHITELIST_COLLECTION } from "../src/configs/db-constant";


(async () => {

    try {
        console.log('[MONGODB] drop collection');

        // Create connection

        const connection = await getMongoClient();
        const db = connection.db(MONGODB_DATABASE);

        // Get existing collections
        
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        // Drop all collections

        if (collectionNames.includes(WHITELIST_COLLECTION)) {
            await db.dropCollection(WHITELIST_COLLECTION);
        }

        if (collectionNames.includes(TODO_COLLECTION)) {
            await db.dropCollection(TODO_COLLECTION);
        }

        if (collectionNames.includes(AUTHORITY_COLLECTION)) {
            await db.dropCollection(AUTHORITY_COLLECTION);
        }

        if (collectionNames.includes(USER_COLLECTION)) {
            await db.dropCollection(USER_COLLECTION);
        }

        if (collectionNames.includes(IMAGE_FILES_COLLECTION)) {
            await db.dropCollection(IMAGE_FILES_COLLECTION);
        }

        if (collectionNames.includes(IMAGE_FILES_CHUNKS)) {
            await db.dropCollection(IMAGE_FILES_CHUNKS);
        }

        if (collectionNames.includes(TAG_COLLECTION)) {
            await db.dropCollection(TAG_COLLECTION);
        }

        if (collectionNames.includes(POST_COLLECTION)) {
            await db.dropCollection(POST_COLLECTION);
        }

        // Close connection

        connection.close();


    } catch (error) {
        console.log(error);
    } finally {
        setTimeout(function () {
            process.exit();
        }, 2000);
    }

})()