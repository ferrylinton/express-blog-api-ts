import { Db } from "mongodb";

export const AUTHORITY_COLLECTION = "authorities";

export const createAuthoritySchema = async (db: Db) => {
    try {
        await db.createCollection(AUTHORITY_COLLECTION, {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    title: AUTHORITY_COLLECTION,
                    additionalProperties: false,
                    properties: {
                        _id: {
                            bsonType: "objectId",
                        },
                        code: {
                            bsonType: "string",
                            minLength: 2,
                            maxLength: 5,
                            description: "Must be a string and unique"
                        },
                        description: {
                            bsonType: "string",
                            minLength: 2,
                            maxLength: 100,
                            description: "Must be a string and unique"
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
                    required: ["code", "description", "createdAt", "updatedAt"],
                },
            },
            validationLevel: "strict",
            validationAction: "error",
        });

        await db
            .collection(AUTHORITY_COLLECTION)
            .createIndexes([
                { name: 'authority_code_unique', unique: true, key: { code: 1 } },
                { name: 'authority_description_unique', unique: true, key: { description: 1 } }
            ]);

    } catch (error) {
        console.error(error);
    }

};