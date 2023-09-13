import { Db } from "mongodb";

export const TAG_COLLECTION = "tags";

export const createTagSchema = async (db: Db) => {
    try {
        await db.createCollection(TAG_COLLECTION, {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    title: TAG_COLLECTION,
                    additionalProperties: false,
                    properties: {
                        _id: {
                            bsonType: "objectId",
                        },
                        name: {
                            bsonType: "string",
                            minLength: 2,
                            maxLength: 30,
                            description: "Must be a string and unique"
                        },
                        description: {
                            bsonType: "string",
                            minLength: 2,
                            description: "Must be a string and unique"
                        },
                        logo: {
                            bsonType: "string",
                            minLength: 2,
                            description: "Must be a string and unique"
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
                    required: ["name", "description", "logo", "createdAt", "createdBy"],
                },
            },
            validationLevel: "strict",
            validationAction: "error",
        });

        await db
            .collection(TAG_COLLECTION)
            .createIndexes([
                { name: 'tag_name_unique', unique: true, key: { tag: 1 } }
            ]);

    } catch (error) {
        console.error(error);
    }

};