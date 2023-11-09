import { NextFunction, Request, Response } from 'express';
import { DeleteResult, ObjectId, UpdateResult } from 'mongodb';
import { ACCESS_FORBIDDEN, DATA_IS_DELETED, DATA_IS_NOT_FOUND, DATA_IS_UPDATED } from '../configs/message-constant';
import * as postService from '../services/post-service';
import { CreatePostSchema, UpdatePostSchema } from '../validations/post-schema';
import { BLOG_OWNER } from '../configs/auth-constant';


export async function find(req: Request, res: Response, next: NextFunction) {
    try {
        const tag = req.query.tag as string || null;
        const keyword = req.query.keyword as string || null;
        const page = req.query.page as string || '1';
        const pageable = await postService.find(tag, keyword, parseInt(page));
        res.status(200).send(pageable);
    } catch (error) {
        next(error);
    }
};

export async function findByIdOrSlug(req: Request, res: Response, next: NextFunction) {
    try {
        const post = ObjectId.isValid(req.params.idOrSlug) ?
            await postService.findById(req.params.idOrSlug) :
            await postService.findBySlug(req.params.idOrSlug);

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
            res.status(400).send(validation.error.issues);
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

        const post = await postService.findById(req.params.idOrSlug);

        if (post) {
            if ((req.auth.username && post.createdBy) || (req.auth.authorities?.includes(BLOG_OWNER))) {
                const deleteResult = await postService.deleteById(new ObjectId(req.params.id));
                deleteResult.deletedCount
                    ? res.status(200).json({ message: DATA_IS_DELETED })
                    : res.status(404).json({ message: DATA_IS_NOT_FOUND });
            } else {
                return res.status(403).json({ message: ACCESS_FORBIDDEN });
            }
        } else {
            res.status(404).json({ message: DATA_IS_NOT_FOUND });
        }



    } catch (error) {
        next(error);
    }
};