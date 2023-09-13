import { Db } from "mongodb";

export const POST_COLLECTION = "posts";

export const createPostSchema = async (db: Db) => {
    try {
        await db.createCollection(POST_COLLECTION, {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    title: POST_COLLECTION,
                    additionalProperties: false,
                    properties: {
                        _id: {
                            bsonType: "objectId",
                        },
                        slug: {
                            bsonType: "string",
                            minLength: 5,
                            maxLength: 30,
                            description: "Must be a string and unique"
                        },
                        title: {
                            bsonType: "string",
                            minLength: 5,
                            maxLength: 100,
                            description: "Must be a string and unique"
                        },
                        description: {
                            bsonType: "string",
                            minLength: 5,
                            maxLength: 200,
                            description: "Must be a string and unique"
                        },
                        tags: {
                            bsonType: "array",
                            description: "Tags must be an array of strings",
                            minItems: 1,
                            uniqueItems: true,
                            items: {
                                bsonType: "string"
                            }
                        },
                        createdBy: {
                            bsonType: "string"
                        },
                        createdAt: {
                            bsonType: "date",
                        },
                        updatedBy: {
                            bsonType: "string"
                        },
                        updatedAt: {
                            bsonType: "date"
                        }
                    },
                    required: ["slug", "title", "description", "tags", "createdAt", "createdBy"],
                },
            },
            validationLevel: "strict",
            validationAction: "error",
        });

        await db
            .collection(POST_COLLECTION)
            .createIndexes([
                { name: 'post_slug_unique', unique: true, key: { slug: 1 } },
                { name: 'post_title_unique', unique: true, key: { post: 1 } },
                { name: 'post_description_unique', unique: true, key: { description: 1 } },
                { name: 'post_createdBy_idx', unique: false, key: { createdBy: 1 } }
            ]);

    } catch (error) {
        console.error(error);
    }

};