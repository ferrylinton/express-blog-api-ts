import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { DATA_IS_DELETED, DATA_IS_NOT_FOUND, DATA_IS_UPDATED } from '../configs/message-constant';
import * as tagService from '../services/tag-service';
import { CreateTagSchema, UpdateTagSchema } from '../validations/tag-schema';


export async function find(req: Request, res: Response, next: NextFunction) {
    try {
        const tags = await tagService.find()
        res.status(200).send(tags);
    } catch (error) {
        next(error);
    }
};

export async function findById(req: Request, res: Response, next: NextFunction) {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: DATA_IS_NOT_FOUND });
        }

        const tag = await tagService.findById(req.params.id);

        if (tag) {
            res.status(200).json(tag);
        } else {
            res.status(404).json({ message: DATA_IS_NOT_FOUND });
        }
    } catch (error) {
        next(error);
    }
};

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const validation = CreateTagSchema.safeParse(req.body);

        if (validation.success) {
            const createdAt = new Date();
            const createdBy = req.auth.username as string;
            const tag = await tagService.create({ createdBy, createdAt, ...validation.data });
            res.status(201).json(tag);
        } else {
            const { fieldErrors: errors } = validation.error.flatten();
            res.status(400).send({ errors });
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

        const validation = UpdateTagSchema.safeParse(req.body);

        if (validation.success) {
            const updatedAt = new Date();
            const updatedBy = req.auth.username as string;
            const _id = new ObjectId(req.params.id);
            const updateResult = await tagService.update({_id, updatedBy, updatedAt, ...validation.data});
            updateResult.modifiedCount
                ? res.status(200).json({ message: DATA_IS_UPDATED })
                : res.status(404).json({ message: DATA_IS_NOT_FOUND });
        } else {
            const { fieldErrors: errors } = validation.error.flatten();
            res.status(400).send({ errors });
        }
    } catch (error) {
        next(error);
    }
};

export async function deleteById(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await tagService.deleteById(req.params.id);

        if (result && result.deletedCount) {
            res.status(200).json({ message: DATA_IS_DELETED });
        } else if (!result) {
            res.status(404).json({ message: DATA_IS_NOT_FOUND });
        }
    } catch (error) {
        next(error);
    }
};