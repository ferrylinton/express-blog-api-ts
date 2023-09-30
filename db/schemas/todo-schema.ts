import { Db } from "mongodb";
import { TODO_COLLECTION } from "../../src/configs/db-constant";



export const createTodoCollection = async (db: Db) => {
    try {
        await db.createCollection(TODO_COLLECTION, {
            "validator": {
                $jsonSchema: {
                    "bsonType": "object",
                    "title": "TODO_COLLECTION",
                    "additionalProperties": false,
                    "properties": {
                        "_id": {
                            "bsonType": "objectId"
                        },
                        "task": {
                            "bsonType": "string",
                            "description": "Must be a string and unique"
                        },
                        "done": {
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
                    "required": ["task", "done", "createdAt", "createdBy"]
                }
            },
            "validationLevel": "strict",
            "validationAction": "error"
        });

        await db
            .collection(TODO_COLLECTION)
            .createIndexes([
                { "name": "todo_unique", "unique": true, "collation": { "locale": "en_US", "strength": 2 }, "key": { "task": 1, "createdBy": 1 } }
            ]);

    } catch (error) {
        console.log(error);
    }

};
