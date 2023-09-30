import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { StorageEngine } from "multer";
import { ParsedQs } from "qs";
import * as imageService from "../services/image-service";
import { MulterCallback } from "../types/image-type";
import { GridFSBucket } from "mongodb";


export class AppStorageEngine implements StorageEngine {

    private bucket: GridFSBucket;

    constructor(bucket: GridFSBucket) {
        this.bucket = bucket;
    }

    _handleFile(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, file: Express.Multer.File, callback: MulterCallback): void {
        try {
            imageService.create(this.bucket, req.auth.username as string, file.originalname, file.mimetype, file.stream, (error?: any, info?: Partial<Express.Multer.File> | undefined) => {
                if (info && info.filename && info.originalname) {
                    if (req.file) {
                        req.file.originalname = info.originalname;
                        req.file.filename = info.filename;
                    }
                }

                callback(error, info);
            });
        } catch (error) {
            console.error(error);
            callback(error);
        }
    }

    _removeFile(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, file: Express.Multer.File, callback: (error: Error | null) => void): void {
        callback(null);
    }

}