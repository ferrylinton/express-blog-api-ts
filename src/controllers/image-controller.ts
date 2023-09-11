import { NextFunction, Request, Response } from 'express';
import * as imageService from '../services/image-service';
import { address } from 'ip';
import { PORT } from '../configs/env-constant';


export async function find(req: Request, res: Response, next: NextFunction) {
    try {
        const images = await imageService.find()
        res.status(200).json(images);
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
        if (req)
            if (req.file === undefined) {
                return res.status(200).json({ message: "you must select a file." });
            } else {
                const local = `http://localhost:${PORT}/api/images/${req.file.originalname}`;
                const remote = `http://${address()}:${PORT}/api/images/${req.file.originalname}`;
                res.status(200).json({ local, remote });
            }
    } catch (error) {
        next(error);
    }
};

export async function deleteById(req: Request, res: Response, next: NextFunction) {
    try {
        await imageService.deleteById(req.params.id);
        res.status(200).json({ message: 'Data is deleted' });
    } catch (error) {
        console.log(error);
        next(error);
    }
};