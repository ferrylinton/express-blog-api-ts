import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { ACCESS_FORBIDDEN, DATA_IS_DELETED, DATA_IS_NOT_FOUND, DATA_IS_UPDATED } from '../configs/message-constant';
import * as userService from '../services/user-service';
import { ChangePasswordSchema, CreateUserSchema, UpdateUserSchema } from '../validations/user-schema';
import { READ_USER_DATA } from '../configs/auth-constant';


export async function find(req: Request, res: Response, next: NextFunction) {
    try {
        const authorities = await userService.find()
        res.status(200).send(authorities);
    } catch (error) {
        next(error);
    }
};

export async function findByIdOrUsername(req: Request, res: Response, next: NextFunction) {
    try {
        const user = ObjectId.isValid(req.params.idOrUsername) ?
            (await userService.findById(req.params.idOrUsername)) :
            (await userService.findByUsername(req.params.idOrUsername));

        if (user) {
            if (req.auth.username === user.username || req.auth.authorities?.includes(READ_USER_DATA)) {
                res.status(200).json(user);
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

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const validation = CreateUserSchema.safeParse(req.body);

        if (validation.success) {
            const createdAt = new Date();
            const createdBy = req.auth.username as string;
            const user = await userService.create({ createdBy, createdAt, ...validation.data });
            res.status(201).json(user);
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

        const validation = UpdateUserSchema.safeParse(req.body);

        if (validation.success) {
            const updatedAt = new Date();
            const updatedBy = req.auth.username as string;
            const _id = new ObjectId(req.params.id);
            const updateResult = await userService.update({ _id, updatedBy, updatedAt, ...validation.data });
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

export async function changePasswordById(req: Request, res: Response, next: NextFunction) {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: DATA_IS_NOT_FOUND });
        }

        const user = await userService.findById(req.params.id);
        if (user) {
            const validation = ChangePasswordSchema.safeParse({ username: user.username, ...req.body });
            if (validation.success) {
                const updateResult = await userService.changePassword({ updatedBy: user.username, ...validation.data });
                updateResult.modifiedCount
                    ? res.status(200).json({ message: DATA_IS_UPDATED })
                    : res.status(404).json({ message: DATA_IS_NOT_FOUND });
            } else {
                res.status(400).send(validation.error.issues);
            }
        } else {
            res.status(404).json({ message: DATA_IS_NOT_FOUND });
        }



    } catch (error) {
        next(error);
    }
};

export async function changePassword(req: Request, res: Response, next: NextFunction) {
    try {
        const validation = ChangePasswordSchema.safeParse(req.body);

        if (validation.success) {
            if (validation.data.username === req.auth.username) {
                const updatedBy = req.auth.username as string;
                const updateResult = await userService.changePassword({ updatedBy, ...validation.data });
                updateResult.modifiedCount
                    ? res.status(200).json({ message: DATA_IS_UPDATED })
                    : res.status(404).json({ message: DATA_IS_NOT_FOUND });
            } else {
                res.status(403).json({ message: "Forbidden" });
            }


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
            const result = await userService.deleteById(req.params.id);

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