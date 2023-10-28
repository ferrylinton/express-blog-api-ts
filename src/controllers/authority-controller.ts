import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { DATA_IS_DELETED, DATA_IS_NOT_FOUND, DATA_IS_UPDATED } from '../configs/message-constant';
import * as authorityService from '../services/authority-service';
import { CreateAuthoritySchema, UpdateAuthoritySchema } from '../validations/authority-schema';


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
        const authority = await authorityService.findById(req.params.id);
        if (authority) {
            res.status(200).json(authority);
        } else {
            res.status(404).json({ message: DATA_IS_NOT_FOUND });
        }
    } catch (error) {
        next(error);
    }
};

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const validation = CreateAuthoritySchema.safeParse(req.body);

        if (validation.success) {
            const createdAt = new Date();
            const createdBy = req.auth.username as string;
            const authority = await authorityService.create({ createdBy, createdAt, ...validation.data });
            res.status(201).json(authority);
        } else {
            res.status(400).send(validation.error.issues);
        }
    } catch (error) {
        next(error);
    }
};

export async function update(req: Request, res: Response, next: NextFunction) {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: DATA_IS_NOT_FOUND });
        }

        const validation = UpdateAuthoritySchema.safeParse(req.body);

        if (validation.success) {
            const updatedAt = new Date();
            const updatedBy = req.auth.username as string;
            const _id = new ObjectId(req.params.id);
            const updateResult = await authorityService.update({ _id, updatedBy, updatedAt, ...validation.data });
            updateResult.modifiedCount
                ? res.status(200).json({ message: DATA_IS_UPDATED })
                : res.status(404).json({ message: DATA_IS_NOT_FOUND });
        } else {
            res.status(400).send(validation.error.issues);
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
            const result = await authorityService.deleteById(req.params.id);

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