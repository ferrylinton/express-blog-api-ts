import { Db } from "mongodb";
import { WHITELIST_COLLECTION } from "../../configs/db-constant";



export const createWhitelistSchema = async (db: Db) => {
    try {
        await db.createCollection(WHITELIST_COLLECTION, {
            "validator": {
                $jsonSchema: {
                    "bsonType": "object",
                    "additionalProperties": false,
                    "properties": {
                        "_id": {
                            "bsonType": "objectId"
                        },
                        "ip": {
                            "bsonType": "string",
                            "description": "Must be a string and unique"
                        },
                        "description": {
                            "bsonType": "string",
                            "minLength": 2,
                            "maxLength": 100,
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
                    "required": ["ip", "description", "createdAt", "createdBy"]
                }
            },
            "validationLevel": "strict",
            "validationAction": "error"
        });

        await db
            .collection(WHITELIST_COLLECTION)
            .createIndexes([
                { "name": "whitelist_ip_unique", "unique": true, "collation": { "locale": "en_US", "strength": 2 }, "key": { "ip": 1 } }
            ]);

    } catch (error) {
        console.log(error);
    }

};