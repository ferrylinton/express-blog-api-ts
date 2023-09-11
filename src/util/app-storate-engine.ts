import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { GridFSBucket, ObjectId } from "mongodb";
import { StorageEngine } from "multer";
import { ParsedQs } from "qs";


const mimetypes = {
    'image/svg+xml': 'svg',
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'image/gif': 'gif'
};

export class AppStorageEngine implements StorageEngine {

    private bucket: GridFSBucket;

    constructor(bucket: GridFSBucket) {
        this.bucket = bucket;
    }

    _handleFile(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, file: Express.Multer.File, callback: (error?: any, info?: Partial<Express.Multer.File> | undefined) => void): void {
        try {
            const arr = file.originalname.split('.');

            if (!mimetypes.hasOwnProperty(file.mimetype)) {
                return callback(new Error('Wrong file type'));
            }

            const _id = new ObjectId();
            const filename = `${arr.length > 0 ? arr[0] : 'unknown'}.${req.auth.username}.${mimetypes[file.mimetype as keyof typeof mimetypes]}`;
            const metadata = {
                createdBy: req.auth.username,
                originalName: file.originalname,
                contentType: file.mimetype
            }

            const cursor = this.bucket.find({ filename, metadata });
            cursor.hasNext()
                .then((isExist) => {
                    if (isExist) {
                        return callback(new Error('Image is already exist'));
                    } else {
                        file.stream.pipe(this.bucket.openUploadStreamWithId(_id, filename, { metadata }))
                            .on('error', function (error) {
                                console.error(error);
                            }).on('finish', async function () {
                                console.log('done!');
                                callback(null);
                            });
                    }
                })



        } catch (error) {
            console.error(error);
            callback(error);
        }
    }

    _removeFile(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, file: Express.Multer.File, callback: (error: Error | null) => void): void {
        callback(null);
    }

}