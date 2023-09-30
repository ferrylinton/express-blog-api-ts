import { Db } from "mongodb";
import { USER_COLLECTION } from "../../src/configs/db-constant";



export const createUserchema = async (db: Db) => {
    try {
        await db.createCollection(USER_COLLECTION, {
            "validator": {
                $jsonSchema: {
                    "bsonType": "object",
                    "additionalProperties": false,
                    "properties": {
                        "_id": {
                            "bsonType": "objectId"
                        },
                        "username": {
                            "bsonType": "string",
                            "description": "Must be a string and unique"
                        },
                        "password": {
                            "bsonType": "string",
                            "description": "Must be a string"
                        },
                        "email": {
                            "bsonType": "string",
                            "description": "Must be a string and unique"
                        },
                        "authorities": {
                            "bsonType": "array",
                            "description": "Authorities must be an array of strings",
                            "minItems": 1,
                            "uniqueItems": true,
                            "items": {
                                "bsonType": "string"
                            }
                        },
                        "loginAttempt": {
                            "bsonType": "int",
                            "description": "It can only be number"
                        },
                        "activated": {
                            "bsonType": "bool",
                            "description": "It can only be true or false"
                        },
                        "locked": {
                            "bsonType": "bool",
                            "description": "It can only be true or false"
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
                    "required": ["username", "email", "password", "authorities", "loginAttempt", "activated", "locked", "createdAt", "createdBy"]
                }
            },
            "validationLevel": "strict",
            "validationAction": "error"
        });

        await db
            .collection(USER_COLLECTION)
            .createIndexes([
                { "name": "user_username_unique", "unique": true, "collation": { "locale": "en_US", "strength": 2 }, "key": { "username": 1 } },
                { "name": "user_email_unique", "unique": true, "collation": { "locale": "en_US", "strength": 2 }, "key": { "email": 1 } }
            ]);

    } catch (error) {
        console.log(error);
    }

};