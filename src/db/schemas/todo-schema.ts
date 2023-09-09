import { Db } from "mongodb";

export const TODO_COLLECTION = "todoes";

export const createTodoCollection = async (db: Db) => {
    try {
        await db.createCollection(TODO_COLLECTION, {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    title: TODO_COLLECTION,
                    additionalProperties: false,
                    properties: {
                        _id: {
                            bsonType: "objectId",
                        },
                        task: {
                            bsonType: "string",
                            description: "Must be a string and unique"
                        },
                        done: {
                            bsonType: "bool",
                            description: "It can only be true or false"
                        },
                        createdAt: {
                            bsonType: "date",
                            description: "Must be a date"
                        },
                        updatedAt: {
                            bsonType: "date",
                            description: "Must be a date"
                        }
                    },
                    required: ["task", "done", "createdAt", "updatedAt"],
                },
            },
            validationLevel: "strict",
            validationAction: "error",
        });

        await db
            .collection(TODO_COLLECTION)
            .createIndex({ task: 1 }, { unique: true });



    } catch (error) {
        console.error(error);
    }

};
