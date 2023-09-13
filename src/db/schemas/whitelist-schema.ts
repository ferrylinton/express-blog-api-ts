import { Db } from "mongodb";

export const WHITELIST_COLLECTION = "whitelists";

export const createWhitelistSchema = async (db: Db) => {
    try {
        await db.createCollection(WHITELIST_COLLECTION, {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    title: WHITELIST_COLLECTION,
                    additionalProperties: false,
                    properties: {
                        _id: {
                            bsonType: "objectId",
                        },
                        ip: {
                            bsonType: "string",
                            description: "Must be a string and unique"
                        },
                        description: {
                            bsonType: "string",
                            minLength: 2,
                            maxLength: 100,
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
                    required: ["ip", "description", "createdAt", "createdBy"],
                },
            },
            validationLevel: "strict",
            validationAction: "error",
        });

        await db
            .collection(WHITELIST_COLLECTION)
            .createIndexes([
                { name: 'whitelist_ip_unique', unique: true, key: { ip: 1 } }
            ]);

    } catch (error) {
        console.error(error);
    }

};