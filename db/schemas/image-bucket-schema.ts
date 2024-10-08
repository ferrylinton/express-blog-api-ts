import { Db } from "mongodb";
import { IMAGE_FILES_CHUNKS, IMAGE_FILES_COLLECTION } from "../../src/configs/db-constant";



export const createImageBucketSchema = async (db: Db) => {
    try {
        await db.createCollection(IMAGE_FILES_CHUNKS);

        await db.createCollection(IMAGE_FILES_COLLECTION, {
            "validator": {
                $jsonSchema: {
                    "bsonType": "object",
                    "additionalProperties": false,
                    "properties": {
                        "_id": {
                            "bsonType": "objectId"
                        },
                        "length": {
                            "bsonType": "int"
                        },
                        "chunkSize": {
                            "bsonType": "int"
                        },
                        "uploadDate": {
                            "bsonType": "date"
                        },
                        "filename": {
                            "bsonType": "string"
                        },
                        "metadata": {
                            "bsonType": "object",
                            "additionalProperties": false,
                            "properties": {
                                "createdBy": {
                                    "bsonType": "string"
                                },
                                "contentType": {
                                    "bsonType": "string"
                                },
                                "originalName": {
                                    "bsonType": "string"
                                },
                                "width": {
                                    "bsonType": "int"
                                },
                                "height": {
                                    "bsonType": "int"
                                }
                            },
                            "required": ["createdBy", "contentType", "originalName"]
                        }
                    },
                    "required": ["length", "chunkSize", "uploadDate", "filename", "metadata"]
                }
            },
            "validationLevel": "strict",
            "validationAction": "error"
        });

        await db
            .collection(IMAGE_FILES_COLLECTION)
            .createIndexes([
                { "name": "image_filename_unique", "unique": true, "collation": { "locale": "en_US", "strength": 2 }, "key": { "filename": 1 } }
            ]);

    } catch (error) {
        console.log(error);
    }

};