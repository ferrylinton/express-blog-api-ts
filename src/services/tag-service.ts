import { DeleteResult, InsertOneResult, ObjectId, OptionalId, UpdateResult, WithId } from "mongodb";
import { getCollection } from "../configs/mongodb";
import { TAG_COLLECTION } from "../db/schemas/tag-schema";
import { WithAudit, Update, Create } from "../types/common-type";
import { Tag } from "../types/tag-type";
import { BadRequestError } from "../errors/badrequest-error";



export const find = async (): Promise<Array<WithAudit<Tag>>> => {
    const tagCollection = await getCollection<WithAudit<Tag>>(TAG_COLLECTION);
    const cursor = tagCollection.find().sort({ 'name': -1 });

    const tags: Array<WithAudit<Tag>> = [];
    for await (const doc of cursor) {
        const { _id, ...rest } = doc;
        tags.push({ id: _id, ...rest });
    }

    return tags;
}

export const findById = async (id: string): Promise<WithAudit<Tag> | null> => {
    if (!ObjectId.isValid(id)) {
        return null;
    }

    const tagCollection = await getCollection<WithAudit<Tag>>(TAG_COLLECTION);
    const tag = await tagCollection.findOne({ _id: new ObjectId(id) });

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
        throw new BadRequestError(400, `Name ['${tag.name}'] is already exist`);
    }

    const insertOneResult: InsertOneResult<WithAudit<Tag>> = await tagCollection.insertOne(tag);
    const { _id, ...rest } = tag;
    return { id: insertOneResult.insertedId, ...rest };
}

export const update = async ({ _id, ...rest }: Update<Tag>): Promise<UpdateResult> => {
    const tagCollection = await getCollection<Tag>(TAG_COLLECTION);
    return await tagCollection.updateOne({ _id }, { $set: rest });
}

export const deleteById = async (id: string): Promise<DeleteResult> => {
    if (!ObjectId.isValid(id)) {
        return { acknowledged: false, deletedCount: 0 };
    }

    const tagCollection = await getCollection<Tag>(TAG_COLLECTION);
    return await tagCollection.deleteOne({ _id: new ObjectId(id) });
}