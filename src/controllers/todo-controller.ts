import { NextFunction, Request, Response } from 'express';
import { DeleteResult, ObjectId, UpdateResult } from 'mongodb';
import { ACCESS_FORBIDDEN, DATA_IS_DELETED, DATA_IS_NOT_FOUND, DATA_IS_UPDATED } from '../configs/message-constant';
import * as todoService from '../services/todo-service';
import { CreateTodoSchema } from '../validations/todo-schema';


export async function find(req: Request, res: Response, next: NextFunction) {
    try {
        const todoes = await todoService.find()
        res.status(200).send(todoes);
    } catch (error) {
        next(error);
    }
};

export async function findById(req: Request, res: Response, next: NextFunction) {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: DATA_IS_NOT_FOUND });
        }

        const todo = await todoService.findById(req.params.id);

        if (todo) {
            res.status(200).json(todo);
        } else {
            res.status(404).json({ message: DATA_IS_NOT_FOUND });
        }
    } catch (error) {
        next(error);
    }
};

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const validation = CreateTodoSchema.safeParse(req.body);

        if (validation.success) {
            const createdAt = new Date();
            const createdBy = req.auth.username as string;
            const done = false;
            const todo = await todoService.create({ done, createdBy, createdAt, ...validation.data });
            res.status(201).json(todo);
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
        const updatedAt = new Date();
        const updatedBy = req.auth.username as string;
        const _id = new ObjectId(req.params.id);
        const owner = req.params.owner;
        const done = true;

        if (owner && owner !== updatedBy) {
            return res.status(403).json({ message: ACCESS_FORBIDDEN });
        } else if (owner) {
            updateResult = await todoService.updateByOwner(owner, { _id, updatedBy, updatedAt, done });
        } else {
            updateResult = await todoService.update({ _id, updatedBy, updatedAt, done });
        }

        updateResult.modifiedCount
            ? res.status(200).json({ message: DATA_IS_UPDATED })
            : res.status(404).json({ message: DATA_IS_NOT_FOUND });
            
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
            deleteResult = await todoService.deleteByOwnerAndId(owner, _id);
        } else {
            deleteResult = await todoService.deleteById(_id);
        }

        deleteResult.deletedCount
            ? res.status(200).json({ message: DATA_IS_DELETED })
            : res.status(404).json({ message: DATA_IS_NOT_FOUND });

    } catch (error) {
        next(error);
    }
};