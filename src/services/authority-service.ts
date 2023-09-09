import { ObjectId, WithId } from "mongodb";
import { getCollection } from "../configs/mongodb";
import { AUTHORITY_COLLECTION } from "../db/schemas/authority-schema";


export const find = async (): Promise<Authority[]> => {
    const authorities: Authority[] = [];
    const authoritiesCollection = await getCollection<Authority>(AUTHORITY_COLLECTION);
    const cursor = authoritiesCollection.find().limit(10).sort({ 'createdAt': -1 });

    for await (const doc of cursor) {
        const { _id, ...other } = doc;
        const id = _id.toHexString();
        authorities.push({ id, ...other });
    }

    return authorities;
}

export const findById = async (_id: ObjectId) => {
    const authoritiesCollection = await getCollection<Authority>(AUTHORITY_COLLECTION);
    const authority = await authoritiesCollection.findOne({ _id });

    if (authority) {
        const { _id, ...other } = authority;
        return { id: _id.toHexString(), ...other };
    } else {
        return authority;
    }
}

export const create = async (code: string, description: string) => {
    const authoritiesCollection = await getCollection<Authority>(AUTHORITY_COLLECTION);

    const now = new Date();
    const authority: Authority = {
        code,
        description,
        createdAt: now,
        updatedAt: now
    }

    const { insertedId: id } = await authoritiesCollection.insertOne(authority);
    const { _id, ...other } = authority as WithId<Authority>;
    return { id, ...other };
}

export const update = async (_id: ObjectId, authorityUpdate: AuthorityUpdate) => {
    const authoritiesCollection = await getCollection<Authority>(AUTHORITY_COLLECTION);

    const data: Partial<Authority> = {
        updatedAt: new Date()
    }

    if (authorityUpdate.code) {
        data.code = authorityUpdate.code;
    }

    if (authorityUpdate.description) {
        data.description = authorityUpdate.description;
    }

    return await authoritiesCollection.updateOne({ _id }, { $set: data });
}

export const deleteById = async (_id: ObjectId) => {
    const authoritiesCollection = await getCollection<Authority>(AUTHORITY_COLLECTION);
    return await authoritiesCollection.deleteOne({ _id });
}