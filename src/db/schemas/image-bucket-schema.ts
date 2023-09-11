import { Db } from "mongodb";

export const IMAGE_FILES_COLLECTION = "images.files";

export const IMAGE_FILES_CHUNKS = "images.chunks";

export const createImageBucketSchema = async (db: Db) => {
    try {
        await db.createCollection(IMAGE_FILES_CHUNKS);

        await db.createCollection(IMAGE_FILES_COLLECTION, {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    title: IMAGE_FILES_COLLECTION,
                    additionalProperties: true,
                    properties: {
                        _id: {
                            bsonType: "objectId",
                        },
                        length: {
                            bsonType: "int",
                        },
                        chunkSize: {
                            bsonType: "int",
                        },
                        uploadDate: {
                            bsonType: "date"
                        },
                        filename: {
                            bsonType: "string"
                        }
                    },
                    required: ["length", "chunkSize", "uploadDate", "filename"],
                },
            },
            validationLevel: "strict",
            validationAction: "error",
        });

        await db
            .collection(IMAGE_FILES_COLLECTION)
            .createIndexes([
                { name: 'image_filename_unique', unique: true, key: { filename: 1 } }
            ]);

    } catch (error) {
        console.error(error);
    }

};