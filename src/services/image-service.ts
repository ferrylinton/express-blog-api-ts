import sizeOf from 'image-size';
import { GridFSBucket, ObjectId, UpdateResult } from "mongodb";
import { PassThrough } from "stream";
import { IMAGE_FILES_COLLECTION } from "../configs/db-constant";
import { IMAGE_BUCKET_NAME, IMAGE_MIME_TYPES } from "../configs/image-constant";
import { getCollection, getDb } from "../configs/mongodb";
import { Pageable, WithAudit } from "../types/common-type";
import { Image, MulterCallback } from "../types/image-type";
import { PAGE_SIZE } from '../configs/pagination-constant';
import { logger } from '../configs/winston';

let bucket: GridFSBucket;

export const find = async (keyword: string | null, page: number) => {
    page = page <= 0 ? 1 : page;
    const imageCollection = await getCollection<WithAudit<Image>>(IMAGE_FILES_COLLECTION);

    const pipeline = [
        {
            '$match': {}
        }, {
            '$sort': {
                'filename': 1
            }
        }, {
            '$facet': {
                'data': [
                    {
                        '$skip': (page - 1) * PAGE_SIZE
                    }, {
                        '$limit': PAGE_SIZE
                    }
                ],
                'pagination': [
                    {
                        '$count': 'total'
                    }
                ]
            }
        }, {
            '$unwind': '$pagination'
        }
    ];

    if (keyword) {
        const regex = new RegExp(keyword, 'i');
        pipeline[0]['$match'] = {
            '$or': [
                { 'filename': regex },
                { 'metadata.originalName': regex },
                { 'metadata.createdBy': regex }
            ]
        }

        logger.info('IMAGE.find : ' + JSON.stringify(pipeline).replaceAll('{}', regex.toString()));
    } else {
        pipeline.shift();
        logger.info('IMAGE.find : ' + JSON.stringify(pipeline));
    }

    const arr = await imageCollection.aggregate<Pageable<Image>>(pipeline).toArray();

    if (arr.length) {
        if (keyword) {
            arr[0].keyword = keyword;
        }

        arr[0].pagination.page = page;
        arr[0].pagination.totalPage = Math.ceil(arr[0].pagination.total / PAGE_SIZE)
        arr[0].pagination.pageSize = PAGE_SIZE;

        arr[0].data = arr[0].data.map(image => {
            const urls = [
                `/api/images/view/${image._id}`,
                `/api/images/view/${image.filename}`,
            ]
            const { _id, ...rest } = image;
            return { id: _id, ...rest, urls }
        })

        return arr[0];
    }

    return {
        "data": [],
        "pagination": {
            "total": 0,
            "totalPage": 0,
            "page": 1,
            "pageSize": 10
        },
        keyword
    };
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

export const create = (bucket: GridFSBucket, createdBy: string, file: Express.Multer.File, callback: MulterCallback) => {
    const arr = file.originalname.split('.');

    if (!IMAGE_MIME_TYPES.hasOwnProperty(file.mimetype)) {
        return callback(new Error('Wrong file type'));
    }


    const filename = `${arr.length > 0 ? arr[0] : 'unknown'}.${createdBy}.${IMAGE_MIME_TYPES[file.mimetype as keyof typeof IMAGE_MIME_TYPES]}`;
    const _id = new ObjectId();
    const tunnel = new PassThrough();
    let buffer = Array<any>();
    tunnel.on("data", chunk => buffer.push(chunk));
    tunnel.on("error", error => callback(error));
    tunnel.on("end", () => {
        const { width, height } = sizeOf(Buffer.concat(buffer));
        setTimeout(() => {
            updateDimension(_id, width || 0, height || 0)
                .catch(error => logger.error(error.message));
        }, 2000);
    })

    const metadata = {
        createdBy,
        originalName: file.originalname,
        contentType: file.mimetype,
        width: 0,
        height: 0
    }

    const cursor = bucket.find({ filename, metadata });
    cursor.hasNext()
        .then((isExist) => {
            if (isExist) {
                return callback(new Error('Image is already exist'));
            } else {
                file.stream.pipe(tunnel).pipe(bucket.openUploadStreamWithId(_id, filename, { metadata }))
                    .on('error', function (error) {
                        callback(error);
                    }).on('finish', function () {
                        callback(null, { filename, originalname: file.originalname });
                    });
            }
        })

}

export const updateDimension = async (_id: ObjectId, width: number, height: number): Promise<UpdateResult> => {
    const imageCollection = await getCollection<WithAudit<Image>>(IMAGE_FILES_COLLECTION);
    return await imageCollection.updateOne({ _id }, { $set: { "metadata.width": width, "metadata.height": height } });
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