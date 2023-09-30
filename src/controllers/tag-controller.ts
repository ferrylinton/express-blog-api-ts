import { NextFunction, Request, Response } from 'express';
import { DeleteResult, ObjectId, UpdateResult } from 'mongodb';
import { ACCESS_FORBIDDEN, DATA_IS_DELETED, DATA_IS_NOT_FOUND, DATA_IS_UPDATED } from '../configs/message-constant';
import * as tagService from '../services/tag-service';
import { CreateTagSchema, UpdateTagSchema } from '../validations/tag-schema';
import { createSlug } from '../util/string-util';


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

        const tag = await tagService.findById(new ObjectId(req.params.id));

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
            const name = createSlug(validation.data.name)
            const createdAt = new Date();
            const createdBy = req.auth.username as string;
            const tag = await tagService.create({name, createdBy, createdAt});
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

        let updateResult: UpdateResult = { acknowledged: false, matchedCount: 0, modifiedCount: 0, upsertedCount: 0, upsertedId: null };
        const validation = UpdateTagSchema.safeParse(req.body);

        if (validation.success) {
            const updatedAt = new Date();
            const updatedBy = req.auth.username as string;
            const _id = new ObjectId(req.params.id);
            const owner = req.params.owner;

            if (owner && owner !== updatedBy) {
                return res.status(403).json({ message: ACCESS_FORBIDDEN });
            } else if (owner) {
                updateResult = await tagService.updateByOwner(owner, { _id, updatedBy, updatedAt, ...validation.data });
            } else {
                updateResult = await tagService.update({ _id, updatedBy, updatedAt, ...validation.data });
            }

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
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: DATA_IS_NOT_FOUND });
        }

        let deleteResult: DeleteResult = { acknowledged: false, deletedCount: 0 };
        const _id = new ObjectId(req.params.id);
        const owner = req.params.owner;
        const createdBy = req.auth.username as string;

        if (owner && owner !== createdBy) {
            return res.status(403).json({ message: ACCESS_FORBIDDEN });
        } else if (owner) {
            deleteResult = await tagService.deleteByOwnerAndId(owner, _id);
        } else {
            deleteResult = await tagService.deleteById(_id);
        }

        deleteResult.deletedCount
            ? res.status(200).json({ message: DATA_IS_DELETED })
            : res.status(404).json({ message: DATA_IS_NOT_FOUND });

    } catch (error) {
        next(error);
    }
};