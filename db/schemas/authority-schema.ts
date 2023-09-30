import { Db } from "mongodb";
import { AUTHORITY_COLLECTION } from "../../src/configs/db-constant";


export const createAuthoritySchema = async (db: Db) => {
    try {
        await db.createCollection(AUTHORITY_COLLECTION, {
            "validator": {
                $jsonSchema: {
                    "bsonType": "object",
                    "additionalProperties": false,
                    "properties": {
                        "_id": {
                            "bsonType": "objectId"
                        },
                        "code": {
                            "bsonType": "string",
                            "minLength": 2,
                            "maxLength": 5,
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
                    "required": ["code", "description", "createdAt", "createdBy"]
                }
            },
            "validationLevel": "strict",
            "validationAction": "error"
        });

        await db
            .collection(AUTHORITY_COLLECTION)
            .createIndexes([
                { "name": "authority_code_unique", "unique": true, "collation": { "locale": "en_US", "strength": 2 }, "key": { "code": 1 } },
                { "name": "authority_description_unique", "unique": true, "collation": { "locale": "en_US", "strength": 2 }, "key": { "description": 1 } }
            ]);

    } catch (error) {
        console.log(error);
    }

};