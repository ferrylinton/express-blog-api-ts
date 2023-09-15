import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { getCollection } from "../configs/mongodb";
import { TAG_COLLECTION } from "../configs/db-constant";
import { BadRequestError } from "../errors/badrequest-error";
import { Create, Update, WithAudit } from "../types/common-type";
import { Tag } from "../types/tag-type";



export const find = async (): Promise<Array<WithAudit<Tag>>> => {
    const tagCollection = await getCollection<WithAudit<Tag>>(TAG_COLLECTION);
    const cursor = tagCollection.find().sort({ 'name': 1 });

    const tags: Array<WithAudit<Tag>> = [];
    for await (const doc of cursor) {
        const { _id, ...rest } = doc;
        tags.push({ id: _id, ...rest });
    }

    return tags;
}

export const findById = async (_id: ObjectId): Promise<WithAudit<Tag> | null> => {
    const tagCollection = await getCollection<WithAudit<Tag>>(TAG_COLLECTION);
    const tag = await tagCollection.findOne({ _id });

    if (tag) {
        const { _id, ...rest } = tag;
        return { id: _id, ...rest };
    }

    return null;
}

export const create = async (tag: Create<Tag>): Promise<WithAudit<Tag>> => {
    const tagCollection = await getCollection<WithAudit<Tag>>(TAG_COLLECTION);
    const current = await tagCollection.findOne({ name: tag.name });

    if (current) {
        throw new BadRequestError(400, `Tag [name='${tag.name}'] is already exist`);
    }

    const insertOneResult: InsertOneResult<WithAudit<Tag>> = await tagCollection.insertOne(tag);
    const { _id, ...rest } = tag;
    return { id: insertOneResult.insertedId, ...rest };
}

export const update = async ({ _id, ...rest }: Update<Tag>): Promise<UpdateResult> => {
    const tagCollection = await getCollection<Tag>(TAG_COLLECTION);
    return await tagCollection.updateOne({ _id }, { $set: rest });
}

export const updateByOwner = async (owner: string, { _id, ...rest }: Update<Tag>): Promise<UpdateResult> => {
    const tagCollection = await getCollection<Tag>(TAG_COLLECTION);
    return await tagCollection.updateOne({ _id, createdBy: owner }, { $set: rest });
}

export const deleteById = async (_id: ObjectId): Promise<DeleteResult> => {
    const tagCollection = await getCollection<Tag>(TAG_COLLECTION);
    return await tagCollection.deleteOne({ _id });
}

export const deleteByOwnerAndId = async (owner: string, _id: ObjectId): Promise<DeleteResult> => {
    const tagCollection = await getCollection<Tag>(TAG_COLLECTION);
    return await tagCollection.deleteOne({ _id, createdBy: owner });
}