import { NextFunction, Request, Response } from 'express';
import multer, { MulterError, StorageEngine } from "multer";
import { AppStorageEngine } from '../util/app-storate-engine';
import { getImagesBucket } from '../services/image-service';



const MAX_FILE_SIZE = 3 * 1024 * 1024;

let storage: StorageEngine;

async function getStorage() {
    if (storage === null || storage === undefined) {
        storage = new AppStorageEngine(await getImagesBucket());
    }

    return storage;
}

export async function uploadImage(req: Request, res: Response, next: NextFunction) {
    const storage = await getStorage();
    const upload = multer({ storage, limits: { fileSize: MAX_FILE_SIZE } }).single("file");


    upload(req, res, function (err: any) {
        if (err) {
            if (err instanceof MulterError) {
                const code = (err as MulterError).code;
                if (code === 'LIMIT_FIELD_KEY') {
                    return res.status(400).json({ message: `Form Input ['file'] is not found` });
                } else if (code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ message: `Form Input ['file'] max size 3mb` });
                }
            }

            next(err)
        } else {
            next();
        }
    })

}