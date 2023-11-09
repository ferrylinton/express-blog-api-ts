import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { DATA_IS_DELETED, DATA_IS_NOT_FOUND, DATA_IS_UPDATED } from '../configs/message-constant';
import * as whitelistService from '../services/whitelist-service';
import { CreateWhitelistSchema, UpdateWhitelistSchema } from '../validations/whitelist-schema';

export async function reload(_req: Request, res: Response, next: NextFunction) {
    try {
        await whitelistService.reload()
        res.status(200).send({"message" : "reloaded"});
    } catch (error) {
        next(error);
    }
};

export async function find(_req: Request, res: Response, next: NextFunction) {
    try {
        const whitelists = await whitelistService.find()
        res.status(200).send(whitelists);
    } catch (error) {
        next(error);
    }
};

export async function findById(req: Request, res: Response, next: NextFunction) {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: DATA_IS_NOT_FOUND });
        }

        const whitelist = await whitelistService.findById(req.params.id);

        if (whitelist) {
            res.status(200).json(whitelist);
        } else {
            res.status(404).json({ message: DATA_IS_NOT_FOUND });
        }
    } catch (error) {
        next(error);
    }
};

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const validation = CreateWhitelistSchema.safeParse(req.body);

        if (validation.success) {
            const createdAt = new Date();
            const createdBy = req.auth.username as string;
            const whitelist = await whitelistService.create({ createdBy, createdAt, ...validation.data });
            await whitelistService.reload();
            res.status(201).json(whitelist);
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

        const validation = UpdateWhitelistSchema.safeParse(req.body);

        if (validation.success) {
            const updatedAt = new Date();
            const updatedBy = req.auth.username as string;
            const _id = new ObjectId(req.params.id);
            const updateResult = await whitelistService.update({ _id, updatedBy, updatedAt, ...validation.data });
            await whitelistService.reload();
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

        const result = await whitelistService.deleteById(req.params.id);
        await whitelistService.reload();

        if (result && result.deletedCount) {
            res.status(200).json({ message: DATA_IS_DELETED });
        } else if (!result.deletedCount) {
            res.status(404).json({ message: DATA_IS_NOT_FOUND });
        }
    } catch (error) {
        next(error);
    }
};