import { NextFunction, Request, Response } from 'express';
import { DeleteResult, ObjectId } from 'mongodb';
import { ACCESS_FORBIDDEN, DATA_IS_DELETED, DATA_IS_NOT_FOUND } from '../configs/message-constant';
import * as imageService from '../services/image-service';
import { IMAGE_ADMIN } from '../configs/auth-constant';


export async function find(req: Request, res: Response, next: NextFunction) {
    try {
        const keyword = req.query.keyword as string || null;
        const page = req.query.page as string || '1';
        const pageable = await imageService.find(keyword, parseInt(page))
        res.status(200).json(pageable);
    } catch (error) {
        next(error);
    }
};

export async function findById(req: Request, res: Response, next: NextFunction) {
    try {
        const image = await imageService.findById(req.params.id);

        if (image) {
            res.status(200).json(image);
        } else {
            res.status(404).json({ message: DATA_IS_NOT_FOUND });
        }
    } catch (error) {
        next(error);
    }
};

export async function viewByIdOrFilename(req: Request, res: Response, next: NextFunction) {
    try {
        const image = ObjectId.isValid(req.params.idOrFilename) ? (await imageService.findById(req.params.idOrFilename)) : (await imageService.findByFilename(req.params.idOrFilename));

        if (image) {
            res.setHeader('Cross-Origin-Opener-Policy', "cross-origin");
            res.setHeader('Cross-Origin-Resource-Policy', "cross-origin");
            res.setHeader('Content-Type', image.metadata.contentType);
            res.setHeader('Content-Length', image.length || '0');
            const bucket = await imageService.getImagesBucket();
            bucket.openDownloadStreamByName(image.filename).pipe(res);
        } else {
            res.status(404).json({ message: DATA_IS_NOT_FOUND });
        }

    } catch (error) {
        next(error);
    }
};

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.file === undefined) {
            return res.status(400).json({ message: "you must select a file." });
        } else {
            const image = await imageService.findByFilename(req.file.filename);
            if (image) {
                res.status(201).json(image);
            } else {
                res.status(404).json({ message: DATA_IS_NOT_FOUND });
            }
        }
    } catch (error) {
        next(error);
    }
};

export async function deleteById(req: Request, res: Response, next: NextFunction) {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: DATA_IS_NOT_FOUND });
        }

        const _id = new ObjectId(req.params.id);
        const image = await imageService.findById(req.params.id);

        if (image) {
            if (req.auth.username === image.metadata.createdBy) {
                await imageService.deleteByOwnerAndId((req.auth.username as string), _id);
            } else if (req.auth.authorities?.includes(IMAGE_ADMIN)) {
                await imageService.deleteById(_id);
            } else {
                return res.status(403).json({ message: ACCESS_FORBIDDEN });
            }

            res.status(200).json({ message: DATA_IS_DELETED });
        } else {
            res.status(404).json({ message: DATA_IS_NOT_FOUND });
        }
    } catch (error) {
        next(error);
    }
};