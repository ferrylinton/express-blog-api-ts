import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { DATA_IS_DELETED, DATA_IS_NOT_FOUND, DATA_IS_UPDATED } from '../configs/message-constant';
import * as userService from '../services/user-service';


export async function find(req: Request, res: Response, next: NextFunction) {
    try {
        const users = await userService.find()
        res.status(200).send(users);
    } catch (error) {
        next(error);
    }
};

export async function findById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        if (ObjectId.isValid(id)) {
            const user = await userService.findById(new ObjectId(id));
            if (user) {
                res.status(200).json(user);
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
        const { username, password } = req.body;
        const user = await userService.create(username, password);
        res.status(201).json(user);
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
            const { modifiedCount } = await userService.update(new ObjectId(id), req.body);
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
            const result = await userService.deleteById(new ObjectId(id));

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