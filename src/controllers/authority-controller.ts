import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { DATA_IS_DELETED, DATA_IS_NOT_FOUND, DATA_IS_UPDATED } from '../configs/message-constant';
import * as authorityService from '../services/authority-service';


export async function find(req: Request, res: Response, next: NextFunction) {
    try {
        const authorities = await authorityService.find()
        res.status(200).send(authorities);
    } catch (error) {
        next(error);
    }
};

export async function findById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        if (ObjectId.isValid(id)) {
            const authority = await authorityService.findById(new ObjectId(id));
            if (authority) {
                res.status(200).json(authority);
            } else {
                res.status(404).json({ message: DATA_IS_NOT_FOUND });
            }
        } else {
            res.status(404).json({ message: DATA_IS_NOT_FOUND });
        }
    } catch (error) {
        next(error);
    }
};

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const { code, description } = req.body;
        const authority = await authorityService.create(code, description);
        res.status(201).json(authority);
    } catch (error) {
        next(error);
    }
};

export async function update(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            res.status(404).json({ message: DATA_IS_NOT_FOUND });
        } else {
            const { modifiedCount } = await authorityService.update(new ObjectId(id), req.body);
            modifiedCount
                ? res.status(200).json({ message: DATA_IS_UPDATED })
                : res.status(404).json({ message: DATA_IS_NOT_FOUND });
        }

    } catch (error) {
        next(error);
    }
};

export async function deleteById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            res.status(404).json({ message: DATA_IS_NOT_FOUND });
        } else {
            const result = await authorityService.deleteById(new ObjectId(id));

            if (result && result.deletedCount) {
                res.status(200).json({ message: DATA_IS_DELETED });
            } else if (!result.deletedCount) {
                res.status(404).json({ message: DATA_IS_NOT_FOUND });
            }
        }
    } catch (error) {
        next(error);
    }
};