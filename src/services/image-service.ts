import { GridFSBucket, ObjectId, WithId } from "mongodb";
import { getCollection, getDb } from "../configs/mongodb";
import { IMAGE_FILES_COLLECTION } from "../configs/db-constant";
import { Image, ImageMetadata, MulterCallback } from "../types/image-type";
import { WithAudit } from "../types/common-type";
import { IMAGE_BUCKET_NAME, IMAGE_MIME_TYPES } from "../configs/image-constant";

let bucket: GridFSBucket;

export const find = async (): Promise<Array<WithAudit<Image>>> => {
    const imageCollection = await getCollection<WithAudit<Image>>(IMAGE_FILES_COLLECTION);
    const cursor = imageCollection.find({}, {
        sort: { filename: 1 }
    });

    const images: Array<WithAudit<Image>> = [];
    for await (const doc of cursor) {
        const { _id, ...rest } = doc;
        images.push({ id: _id, ...rest });
    }

    return images;
}

export const findById = async (_id: ObjectId): Promise<WithAudit<Image> | null> => {
    const imageCollection = await getCollection<WithAudit<Image>>(IMAGE_FILES_COLLECTION);
    const image = await imageCollection.findOne({ _id });

    if (image) {
        const { _id, ...rest } = image;
        return { id: _id, ...rest };
    }

    return null;
}

export const findByFilename = async (filename: string): Promise<WithAudit<Image> | null> => {
    const imageCollection = await getCollection<WithAudit<Image>>(IMAGE_FILES_COLLECTION);
    const image = await imageCollection.findOne({ filename });

    if (image) {
        const { _id, ...rest } = image;
        return { id: _id, ...rest };
    }

    return null;
}

export const create = async (owner: string, file: Express.Multer.File, callback: MulterCallback) => {
    const bucket = await getImagesBucket();
    const arr = file.originalname.split('.');

    if (!IMAGE_MIME_TYPES.hasOwnProperty(file.mimetype)) {
        return callback(new Error('Wrong file type'));
    }

    const _id = new ObjectId();
    const filename = `${arr.length > 0 ? arr[0] : 'unknown'}.${owner}.${IMAGE_MIME_TYPES[file.mimetype as keyof typeof IMAGE_MIME_TYPES]}`;
    const metadata = {
        createdBy: owner,
        originalName: file.originalname,
        contentType: file.mimetype
    }

    const cursor = bucket.find({ filename, metadata });
    cursor.hasNext()
        .then((isExist) => {
            if (isExist) {
                return callback(new Error('Image is already exist'));
            } else {
                file.stream.pipe(bucket.openUploadStreamWithId(_id, filename, { metadata }))
                    .on('error', function (error) {
                        callback(error);
                    }).on('finish', async function () {
                        callback(null, { filename });
                    });
            }
        })
}

export const deleteById = async (_id: ObjectId): Promise<void> => {
    const bucket = await getImagesBucket();
    await bucket.delete(_id);
}

export const deleteByOwnerAndId = async (owner: string, _id: ObjectId): Promise<WithAudit<Image> | null> => {
    const imageCollection = await getCollection<WithAudit<Image>>(IMAGE_FILES_COLLECTION);
    const image = await imageCollection.findOne({ _id, "metadata.createdBy": owner });

    if (image) {
        const { _id, ...rest } = image;
        const bucket = await getImagesBucket();
        await bucket.delete(_id);

        return { id: _id, ...rest };
    }

    return null;
}

export const getImagesBucket = async () => {
    if (bucket === undefined || bucket === null) {
        const db = await getDb();
        bucket = new GridFSBucket(db, { bucketName: IMAGE_BUCKET_NAME });
    }

    return bucket;
}