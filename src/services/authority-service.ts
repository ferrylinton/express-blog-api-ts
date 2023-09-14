import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { getCollection } from "../configs/mongodb";
import { AUTHORITY_COLLECTION } from "../configs/db-constant";
import { BadRequestError } from "../errors/badrequest-error";
import { Authority } from "../types/authority-type";
import { Create, Update, WithAudit } from "../types/common-type";


export const find = async (): Promise<Array<WithAudit<Authority>>> => {
    const authorityCollection = await getCollection<WithAudit<Authority>>(AUTHORITY_COLLECTION);
    const cursor = authorityCollection.find().sort({ 'code': -1 });

    const authorities: Array<WithAudit<Authority>> = [];
    for await (const doc of cursor) {
        const { _id, ...rest } = doc;
        authorities.push({ id: _id, ...rest });
    }

    return authorities;
}

export const findById = async (id: string): Promise<WithAudit<Authority> | null> => {
    if (!ObjectId.isValid(id)) {
        return null;
    }

    const authorityCollection = await getCollection<WithAudit<Authority>>(AUTHORITY_COLLECTION);
    const authority = await authorityCollection.findOne({ _id: new ObjectId(id) });

    if (authority) {
        const { _id, ...rest } = authority;
        return { id: _id, ...rest };
    }

    return null;
}

export const create = async (authority: Create<Authority>): Promise<WithAudit<Authority>> => {
    const authorityCollection = await getCollection<WithAudit<Authority>>(AUTHORITY_COLLECTION);
    const current = await authorityCollection.findOne({
        "$or": [{
            "code": authority.code
        }, {
            "description": authority.description
        }]
    });

    if (current) {
        throw new BadRequestError(400, `Authority [code='${authority.code}'] or [description='${authority.description}'] is already exist`);
    }

    const insertOneResult: InsertOneResult<WithAudit<Authority>> = await authorityCollection.insertOne(authority);
    const { _id, ...rest } = authority;
    return { id: insertOneResult.insertedId, ...rest };
}

export const update = async ({ _id, ...rest }: Update<Authority>): Promise<UpdateResult> => {
    const authorityCollection = await getCollection<Authority>(AUTHORITY_COLLECTION);
    return await authorityCollection.updateOne({ _id }, { $set: rest });
}

export const deleteById = async (id: string): Promise<DeleteResult> => {
    if (!ObjectId.isValid(id)) {
        return { acknowledged: false, deletedCount: 0 };
    }

    const authorityCollection = await getCollection<Authority>(AUTHORITY_COLLECTION);
    return await authorityCollection.deleteOne({ _id: new ObjectId(id) });
}