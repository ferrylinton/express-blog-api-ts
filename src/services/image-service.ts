import { GridFSBucket, ObjectId, WithId } from "mongodb";
import { getCollection, getDb } from "../configs/mongodb";
import { IMAGE_FILES_COLLECTION } from "../configs/db-constant";

let bucket: GridFSBucket;

export const IMAGE_BUCKET_NAME = 'images';

export const find = async (): Promise<Image[]> => {
    const imageCollection = await getCollection<Image>(IMAGE_FILES_COLLECTION);
    const cursor = imageCollection.find({}, {
        sort: { filename: 1 }
    });

    const images: Image[] = [];
    for await (const doc of cursor) {
        images.push({
            id: doc._id.toHexString(),
            filename: doc.filename,
            uploadDate: doc.uploadDate,
            length: doc.length,
            metadata: doc.metadata
        })
    }

    return images;
}

export const findById = async (id: string): Promise<Image | null> => {
    if (!ObjectId.isValid(id)) {
        return null;
    }

    const filter = {
        _id: new ObjectId(id)
    };

    const imageCollection = await getCollection<Image>(IMAGE_FILES_COLLECTION);
    const Image = await imageCollection.findOne(filter) as WithId<Image>;

    if (Image) {
        Image.id = (Image._id as ObjectId).toHexString();
        return Image;
    } else {
        return null;
    }
}

export const findByFilename = async (filename: string): Promise<Image | null> => {
    const imageCollection = await getCollection<Image>(IMAGE_FILES_COLLECTION);
    const Image = await imageCollection.findOne({ filename }) as WithId<Image>;

    if (Image) {
        Image.id = (Image._id as ObjectId).toHexString();
        return Image;
    } else {
        return null;
    }
}

export const deleteById = async (id: string): Promise<void> => {
    if (!ObjectId.isValid(id)) {
        throw new Error('Data is not found')
    }

    const bucket = await getImagesBucket();
    await bucket.delete(new ObjectId(id));
}

export const getImagesBucket = async () => {
    if (bucket === undefined || bucket === null) {
        const db = await getDb();
        bucket = new GridFSBucket(db, { bucketName: IMAGE_BUCKET_NAME });
    }

    return bucket;
}