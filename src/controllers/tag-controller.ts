import { NextFunction, Request, Response } from 'express';
import { DeleteResult, ObjectId, UpdateResult } from 'mongodb';
import { ACCESS_FORBIDDEN, DATA_IS_DELETED, DATA_IS_NOT_FOUND, DATA_IS_UPDATED } from '../configs/message-constant';
import * as tagService from '../services/tag-service';
import { CreateTagSchema, UpdateTagSchema } from '../validations/tag-schema';
import { createSlug } from '../util/string-util';
import { BLOG_ADMIN } from '../configs/auth-constant';


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
            const tag = await tagService.create({ name, createdBy, createdAt });
            res.status(201).json(tag);
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

        const _id = new ObjectId(req.params.id);
        const tag = await tagService.findById(_id);

        if (tag) {
            const validation = UpdateTagSchema.safeParse(req.body);

            if (validation.success) {
                const updatedAt = new Date();
                const updatedBy = req.auth.username as string;
                
                if (req.auth.username === tag.createdBy) {
                    await tagService.updateByOwner(updatedBy, { _id, updatedBy, updatedAt, ...validation.data });
                } else if(req.auth.authorities?.includes(BLOG_ADMIN)){
                    await tagService.update({ _id, updatedBy, updatedAt, ...validation.data });
                }else{
                    return res.status(403).json({ message: ACCESS_FORBIDDEN });
                }

                res.status(200).json({...tag, ...validation.data})
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

export async function deleteById(req: Request, res: Response, next: NextFunction) {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: DATA_IS_NOT_FOUND });
        }

        const _id = new ObjectId(req.params.id);
        const tag = await tagService.findById(new ObjectId(req.params.id));

        if(tag){
            let deleteResult: DeleteResult = { acknowledged: false, deletedCount: 0 };
            
    
            if (req.auth.username === tag.createdBy) {
                deleteResult = await tagService.deleteByOwnerAndId((req.auth.username as string), _id);
            } else if(req.auth.authorities?.includes(BLOG_ADMIN)){
                deleteResult = await tagService.deleteById(_id);
            } else {
                return res.status(403).json({ message: ACCESS_FORBIDDEN });
            }
    
            deleteResult.deletedCount
                ? res.status(200).json({ message: DATA_IS_DELETED })
                : res.status(404).json({ message: DATA_IS_NOT_FOUND });
        } else {
            res.status(404).json({ message: DATA_IS_NOT_FOUND });
        }

        

    } catch (error) {
        next(error);
    }
};