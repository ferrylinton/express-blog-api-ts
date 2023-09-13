import { MONGODB_DATABASE } from "../../configs/env-constant";
import { mongoClient } from "../../configs/mongodb";
import { AUTHORITY_COLLECTION, createAuthoritySchema } from "../schemas/authority-schema";
import { IMAGE_FILES_COLLECTION, createImageBucketSchema } from "../schemas/image-bucket-schema";
import { POST_COLLECTION, createPostSchema } from "../schemas/post-schema";
import { TAG_COLLECTION, createTagSchema } from "../schemas/tag-schema";
import { TODO_COLLECTION, createTodoCollection } from "../schemas/todo-schema";
import { USER_COLLECTION, createUserchema } from "../schemas/user-schema";
import { WHITELIST_COLLECTION, createWhitelistSchema } from "../schemas/whitelist-schema";

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