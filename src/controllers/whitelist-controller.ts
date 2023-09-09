import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { DATA_IS_DELETED, DATA_IS_NOT_FOUND, DATA_IS_UPDATED } from '../configs/message-constant';
import * as whitelistService from '../services/whitelist-service';

export async function reload(req: Request, res: Response, next: NextFunction) {
    try {
        const whitelists = await whitelistService.reload()
        res.status(200).send(whitelists);
    } catch (error) {
        next(error);
    }
};

export async function find(req: Request, res: Response, next: NextFunction) {
    try {
        const whitelists = await whitelistService.find()
        res.status(200).send(whitelists);
    } catch (error) {
        next(error);
    }
};

export async function findById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        if (ObjectId.isValid(id)) {
            const whitelist = await whitelistService.findById(new ObjectId(id));
            if (whitelist) {
                res.status(200).json(whitelist);
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
        const { ip } = req.body;
        const whitelist = await whitelistService.create(ip);
        res.status(201).json(whitelist);
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
            const result = await whitelistService.deleteById(new ObjectId(id));

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