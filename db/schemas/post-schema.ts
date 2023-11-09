import { Db } from "mongodb";
import { POST_COLLECTION } from "../../src/configs/db-constant";



export const createPostSchema = async (db: Db) => {
    try {
        await db.createCollection(POST_COLLECTION, {
            "validator": {
                $jsonSchema: {
                    "bsonType": "object",
                    "title": "POST_COLLECTION",
                    "additionalProperties": false,
                    "properties": {
                        "_id": {
                            "bsonType": "objectId"
                        },
                        "slug": {
                            "bsonType": "string",
                            "minLength": 3,
                            "maxLength": 30,
                            "description": "Must be a string and unique"
                        },
                        "tags": {
                            "bsonType": "array",
                            "description": "Tags must be an array of strings",
                            "minItems": 1,
                            "uniqueItems": true,
                            "items": {
                                "bsonType": "string"
                            }
                        },
                        "title": {
                            "bsonType": "object",
                            "properties": {
                                "id": {
                                    "bsonType": "string",
                                    "minLength": 3,
                                    "description": "Must be a string and unique"
                                },
                                "en": {
                                    "bsonType": "string",
                                    "minLength": 3,
                                    "description": "Must be a string and unique"
                                }
                            },
                            "required": ["id", "en"]
                        },
                        "description": {
                            "bsonType": "object",
                            "properties": {
                                "id": {
                                    "bsonType": "string",
                                    "minLength": 3,
                                    "description": "Must be a string and unique"
                                },
                                "en": {
                                    "bsonType": "string",
                                    "minLength": 3,
                                    "description": "Must be a string and unique"
                                }
                            },
                            "required": ["id", "en"]
                        },
                        "content": {
                            "bsonType": "object",
                            "properties": {
                                "id": {
                                    "bsonType": "string",
                                    "minLength": 3,
                                    "description": "Must be a string and unique"
                                },
                                "en": {
                                    "bsonType": "string",
                                    "minLength": 3,
                                    "description": "Must be a string and unique"
                                }
                            },
                            "required": ["id", "en"]
                        },
                        "createdBy": {
                            "bsonType": "string"
                        },
                        "createdAt": {
                            "bsonType": "date"
                        },
                        "updatedBy": {
                            "bsonType": "string"
                        },
                        "updatedAt": {
                            "bsonType": "date"
                        }
                    },
                    "required": ["slug", "tags", "createdAt", "createdBy", "title", "description", "content"]
                }
            },
            "validationLevel": "strict",
            "validationAction": "error"
        });

        await db
            .collection(POST_COLLECTION)
            .createIndexes([
                { "name": "post_slug_unique", "unique": true, "collation": { "locale": "en_US", "strength": 2 }, "key": { "slug": 1 } },
                { "name": "title_id_unique", "unique": true, "collation": { "locale": "en_US", "strength": 2 }, "key": { "title.id": 1 } },
                { "name": "title_en_unique", "unique": true, "collation": { "locale": "en_US", "strength": 2 }, "key": { "title.en": 1 } },
                { "name": "description_id_unique", "unique": true, "collation": { "locale": "en_US", "strength": 2 }, "key": { "description.id": 1 } },
                { "name": "description_en_unique", "unique": true, "collation": { "locale": "en_US", "strength": 2 }, "key": { "description.en": 1 } },
                { "name": "post_createdBy_idx", "unique": false, "key": { "createdBy": 1 } }
            ]);

    } catch (error) {
        console.error(error);
    }

};