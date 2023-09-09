import { Db } from "mongodb";

export const USER_COLLECTION = "users";

export const createUserchema = async (db: Db) => {
    try {
        await db.createCollection(USER_COLLECTION, {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    title: USER_COLLECTION,
                    additionalProperties: false,
                    properties: {
                        _id: {
                            bsonType: "objectId",
                        },
                        username: {
                            bsonType: "string",
                            description: "Must be a string and unique"
                        },
                        password: {
                            bsonType: "string",
                            description: "Must be a string"
                        },
                        email: {
                            bsonType: "string",
                            description: "Must be a string and unique"
                        },
                        authorities: {
                            bsonType: "array",
                            description: "Authorities must be an array of strings",
                            minItems: 1,
                            uniqueItems: true,
                            items: {
                                bsonType: "string"
                            }
                        },
                        loginAttempt: {
                            bsonType: 'int',
                            description: 'It can only be number'
                        },
                        activated: {
                            bsonType: 'bool',
                            description: 'It can only be true or false'
                        },
                        locked: {
                            bsonType: 'bool',
                            description: 'It can only be true or false'
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
                    required: ["username", "email", "password", "authorities", "loginAttempt", "activated", "locked", "createdAt", "updatedAt"],
                },
            },
            validationLevel: "strict",
            validationAction: "error",
        });

        await db
            .collection(USER_COLLECTION)
            .createIndex({ username: 1 }, { unique: true });

    } catch (error) {
        console.error(error);
    }

};