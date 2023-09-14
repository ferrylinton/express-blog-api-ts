import { AUTHORITY_COLLECTION, IMAGE_FILES_COLLECTION, POST_COLLECTION, TAG_COLLECTION, TODO_COLLECTION, USER_COLLECTION, WHITELIST_COLLECTION } from "../../configs/db-constant";
import { MONGODB_DATABASE } from "../../configs/env-constant";
import { mongoClient } from "../../configs/mongodb";
import { createAuthoritySchema } from "../schemas/authority-schema";
import { createImageBucketSchema } from "../schemas/image-bucket-schema";
import { createPostSchema } from "../schemas/post-schema";
import { createTagSchema } from "../schemas/tag-schema";
import { createTodoCollection } from "../schemas/todo-schema";
import { createUserchema } from "../schemas/user-schema";
import { createWhitelistSchema } from "../schemas/whitelist-schema";

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

        if (!collectionNames.includes(WHITELIST_COLLECTION)) {
            await createWhitelistSchema(db);
        }

        if (!collectionNames.includes(TODO_COLLECTION)) {
            await createTodoCollection(db);
        }

        if (!collectionNames.includes(AUTHORITY_COLLECTION)) {
            await createAuthoritySchema(db);
        }

        if (!collectionNames.includes(USER_COLLECTION)) {
            await createUserchema(db);
        }

        if (!collectionNames.includes(IMAGE_FILES_COLLECTION)) {
            await createImageBucketSchema(db);
        }

        if (!collectionNames.includes(TAG_COLLECTION)) {
            await createTagSchema(db);
        }

        if (!collectionNames.includes(POST_COLLECTION)) {
            await createPostSchema(db);
        }

        // Close connection
        connection.close();

    } catch (error) {
        console.error(error);
    }

})()