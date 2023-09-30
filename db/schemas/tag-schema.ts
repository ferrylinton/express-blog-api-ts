import { Db } from "mongodb";
import { TAG_COLLECTION } from "../../src/configs/db-constant";



export const createTagSchema = async (db: Db) => {
    try {
        await db.createCollection(TAG_COLLECTION, {
            "validator": {
                $jsonSchema: {
                    "bsonType": "object",
                    "additionalProperties": false,
                    "properties": {
                        "_id": {
                            "bsonType": "objectId"
                        },
                        "name": {
                            "bsonType": "string",
                            "minLength": 2,
                            "maxLength": 30,
                            "description": "Must be a string and unique"
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
                    "required": ["name", "createdAt", "createdBy"]
                }
            },
            "validationLevel": "strict",
            "validationAction": "error"
        });

        await db
            .collection(TAG_COLLECTION)
            .createIndexes([
                { "name": "tag_name_unique", "unique": true, "collation": { "locale": "en_US", "strength": 2 }, "key": { "name": 1 } }
            ]);

    } catch (error) {
        console.log(error);
    }

};