import * as auth from "../src/configs/db-constant";
import { MONGODB_DATABASE } from "../src/configs/env-constant";
import { mongoClient } from "../src/configs/mongodb";
import { createAuthoritySchema } from "./schemas/authority-schema";
import { createImageBucketSchema } from "./schemas/image-bucket-schema";
import { createPostSchema } from "./schemas/post-schema";
import { createTagSchema } from "./schemas/tag-schema";
import { createUserchema } from "./schemas/user-schema";
import { createWhitelistSchema } from "./schemas/whitelist-schema";

(async () => {

    try {
        console.log('[MONGODB] create collection');

        // Create connection

        const connection = await mongoClient;
        const db = connection.db(MONGODB_DATABASE);

        // Get existing collections

        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        // Create collections if not exist

        if (!collectionNames.includes(auth.WHITELIST_COLLECTION)) {
            await createWhitelistSchema(db);
        }

        if (!collectionNames.includes(auth.AUTHORITY_COLLECTION)) {
            await createAuthoritySchema(db);
        }

        if (!collectionNames.includes(auth.USER_COLLECTION)) {
            await createUserchema(db);
        }

        if (!collectionNames.includes(auth.IMAGE_FILES_COLLECTION)) {
            await createImageBucketSchema(db);
        }

        if (!collectionNames.includes(auth.TAG_COLLECTION)) {
            await createTagSchema(db);
        }

        if (!collectionNames.includes(auth.POST_COLLECTION)) {
            await createPostSchema(db);
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