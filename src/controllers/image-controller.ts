import { NextFunction, Request, Response } from 'express';
import { address } from 'ip';
import { ObjectId } from 'mongodb';
import { PORT } from '../configs/env-constant';
import { ACCESS_FORBIDDEN, DATA_IS_NOT_FOUND } from '../configs/message-constant';
import * as imageService from '../services/image-service';


export async function find(req: Request, res: Response, next: NextFunction) {
    try {
        const images = await imageService.find()
        res.status(200).json(images);
    } catch (error) {
        next(error);
    }
};

export async function findById(req: Request, res: Response, next: NextFunction) {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: DATA_IS_NOT_FOUND });
        }

        const image = await imageService.findById(new ObjectId(req.params.id));

        if (image) {
            res.status(200).json(image);
        } else {
            res.status(404).json({ message: DATA_IS_NOT_FOUND });
        }
    } catch (error) {
        next(error);
    }
};

export async function findByFilename(req: Request, res: Response, next: NextFunction) {
    try {
        const image = await imageService.findByFilename(req.params.filename);

        if (image) {
            res.setHeader('Content-Type', image.metadata.contentType);
            res.setHeader('Content-Length', image.length || '0');
            const bucket = await imageService.getImagesBucket();
            bucket.openDownloadStreamByName(image.filename).pipe(res);
        } else {
            res.status(404).json({ message: 'Data is not found' });
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
            const local = `http://localhost:${PORT}/api/images/${req.file.filename}`;
            const remote = `http://${address()}:${PORT}/api/images/${req.file.filename}`;
            res.status(200).json({ local, remote });
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
        const owner = req.params.owner;
        const createdBy = req.auth.username as string;

        if (owner && owner !== createdBy) {
            return res.status(403).json({ message: ACCESS_FORBIDDEN });
        } else if (owner) {
            await imageService.deleteByOwnerAndId(owner, _id);
        } else {
            await imageService.deleteById(_id);
        }

        res.status(200).json({ message: 'Data is deleted' });
    } catch (error) {
        console.log(error);
        next(error);
    }
};