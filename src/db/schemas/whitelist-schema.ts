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
                        createdAt: {
                            bsonType: "date",
                            description: "Must be a date"
                        }
                    },
                    required: ["ip", "createdAt"],
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