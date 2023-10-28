import sizeOf from 'image-size';
import { GridFSBucket, ObjectId } from "mongodb";
import { PassThrough, Readable } from "stream";
import { IMAGE_FILES_COLLECTION } from "../configs/db-constant";
import { IMAGE_BUCKET_NAME, IMAGE_MIME_TYPES } from "../configs/image-constant";
import { getCollection, getDb } from "../configs/mongodb";
import { WithAudit } from "../types/common-type";
import { Image, MulterCallback } from "../types/image-type";

let bucket: GridFSBucket;

export const find = async (): Promise<Array<WithAudit<Image>>> => {
    const imageCollection = await getCollection<WithAudit<Image>>(IMAGE_FILES_COLLECTION);
    const cursor = imageCollection.find({}, {
        sort: { filename: 1 }
    });

    const images: Array<WithAudit<Image>> = [];
    for await (const doc of cursor) {
        const urls = [
            `/api/images/view/${doc._id}`,
            `/api/images/view/${doc.filename}`,
        ]
        const { _id, ...rest } = doc;
        images.push({ id: _id, ...rest, urls });
    }

    return images;
}

export const findById = async (id: string): Promise<WithAudit<Image> | null> => {
    if (!ObjectId.isValid(id)) {
        return null;
    }

    const imageCollection = await getCollection<WithAudit<Image>>(IMAGE_FILES_COLLECTION);
    const image = await imageCollection.findOne({ _id: new ObjectId(id) });

    if (image) {
        const urls = [
            `/api/images/view/${image._id}`,
            `/api/images/view/${image.filename}`,
        ]
        const { _id, ...rest } = image;
        return { id: _id, ...rest, urls };
    }

    return null;
}

export const findByFilename = async (filename: string): Promise<WithAudit<Image> | null> => {
    const imageCollection = await getCollection<WithAudit<Image>>(IMAGE_FILES_COLLECTION);
    const image = await imageCollection.findOne({ filename });

    if (image) {
        const urls = [
            `/api/images/view/${image._id}`,
            `/api/images/view/${image.filename}`,
        ]
        const { _id, ...rest } = image;
        return { id: _id, ...rest, urls };
    }

    return null;
}

export const create = (bucket: GridFSBucket, createdBy: string, originalName: string, contentType: string, stream: Readable, callback: MulterCallback) => {
    const arr = originalName.split('.');

    if (!IMAGE_MIME_TYPES.hasOwnProperty(contentType)) {
        return callback(new Error('Wrong file type'));
    }


    const filename = `${arr.length > 0 ? arr[0] : 'unknown'}.${createdBy}.${IMAGE_MIME_TYPES[contentType as keyof typeof IMAGE_MIME_TYPES]}`;

    const tunnel = new PassThrough();
    let buffer = Array<any>();
    let width: number = 0;
    let height: number = 0;
    tunnel.on("data", chunk => buffer.push(chunk));
    tunnel.on("error", error => callback(error));
    tunnel.on("end", () => {
        const result = sizeOf(Buffer.concat(buffer));
        width = result.width || 0;
        height = result.height || 0;
    })

    const metadata = {
        createdBy,
        originalName,
        contentType
    }

    const cursor = bucket.find({ filename, metadata });
    cursor.hasNext()
        .then((isExist) => {
            if (isExist) {
                return callback(new Error('Image is already exist'));
            } else {
                stream.pipe(tunnel).pipe(bucket.openUploadStream(filename, { metadata: { width, height, ...metadata } }))
                    .on('error', function (error) {
                        callback(error);
                    }).on('finish', function () {
                        callback(null, { filename });
                    });
            }
        })

}

export const deleteById = async (_id: ObjectId): Promise<void> => {
    const bucket = await getImagesBucket();
    await bucket.delete(_id);
}

export const deleteByOwnerAndId = async (createdBy: string, _id: ObjectId): Promise<WithAudit<Image> | null> => {
    const imageCollection = await getCollection<WithAudit<Image>>(IMAGE_FILES_COLLECTION);
    const image = await imageCollection.findOne({ _id, "metadata.createdBy": createdBy });

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