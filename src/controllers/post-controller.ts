import { NextFunction, Request, Response } from 'express';
import { DeleteResult, ObjectId, UpdateResult } from 'mongodb';
import { ACCESS_FORBIDDEN, DATA_IS_DELETED, DATA_IS_NOT_FOUND, DATA_IS_UPDATED } from '../configs/message-constant';
import * as postService from '../services/post-service';
import { CreatePostSchema, UpdatePostSchema } from '../validations/post-schema';


export async function find(req: Request, res: Response, next: NextFunction) {
    try {
        const posts = await postService.find()
        res.status(200).send(posts);
    } catch (error) {
        next(error);
    }
};

export async function findById(req: Request, res: Response, next: NextFunction) {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: DATA_IS_NOT_FOUND });
        }

        const post = await postService.findById(req.params.id);

        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: DATA_IS_NOT_FOUND });
        }
    } catch (error) {
        next(error);
    }
};

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const validation = CreatePostSchema.safeParse(req.body);

        if (validation.success) {
            const createdAt = new Date();
            const createdBy = req.auth.username as string;
            const post = await postService.create({ createdBy, createdAt, ...validation.data });
            res.status(201).json(post);
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
        const validation = UpdatePostSchema.safeParse(req.body);

        if (validation.success) {
            const updatedAt = new Date();
            const updatedBy = req.auth.username as string;
            const _id = new ObjectId(req.params.id);
            const owner = req.params.owner;

            if (owner && owner !== updatedBy) {
                return res.status(403).json({ message: ACCESS_FORBIDDEN });
            } else if (owner) {
                updateResult = await postService.updateByOwner(owner, { _id, updatedBy, updatedAt, ...validation.data });
            } else {
                updateResult = await postService.update({ _id, updatedBy, updatedAt, ...validation.data });
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
        const updatedBy = req.auth.username as string;

        if (owner && owner !== updatedBy) {
            return res.status(403).json({ message: ACCESS_FORBIDDEN });
        } else if (owner) {
            deleteResult = await postService.deleteByOwnerAndId(owner, _id);
        } else {
            deleteResult = await postService.deleteById(_id);
        }

        deleteResult.deletedCount
            ? res.status(200).json({ message: DATA_IS_DELETED })
            : res.status(404).json({ message: DATA_IS_NOT_FOUND });

    } catch (error) {
        next(error);
    }
};