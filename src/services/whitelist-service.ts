import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { getCollection } from "../configs/mongodb";
import { WHITELIST_COLLECTION } from "../configs/db-constant";
import { BadRequestError } from "../errors/badrequest-error";
import { Create, Update, WithAudit } from "../types/common-type";
import { allows } from "../middleware/ip-whitelist-handler";


export const reload = async (): Promise<void> => {
    const whitelistsCollection = await getCollection<{ ip: string }>(WHITELIST_COLLECTION);
    const cursor = whitelistsCollection.find({}, {
        projection: { _id: 0, ip: 1, createdAt: 1 },
    });

    allows.splice(0, allows.length);
    for await (const doc of cursor) {
        const { ip } = doc;
        allows.push(ip)
    }
}

export const find = async (): Promise<Array<WithAudit<Whitelist>>> => {
    const whitelistCollection = await getCollection<WithAudit<Whitelist>>(WHITELIST_COLLECTION);
    const cursor = whitelistCollection.find().sort({ 'code': -1 });

    const whitelists: Array<WithAudit<Whitelist>> = [];
    for await (const doc of cursor) {
        const { _id, ...rest } = doc;
        whitelists.push({ id: _id, ...rest });
    }

    return whitelists;
}

export const findById = async (id: string): Promise<WithAudit<Whitelist> | null> => {
    if (!ObjectId.isValid(id)) {
        return null;
    }

    const whitelistCollection = await getCollection<WithAudit<Whitelist>>(WHITELIST_COLLECTION);
    const whitelist = await whitelistCollection.findOne({ _id: new ObjectId(id) });

    if (whitelist) {
        const { _id, ...rest } = whitelist;
        return { id: _id, ...rest };
    }

    return null;
}

export const create = async (whitelist: Create<Whitelist>): Promise<WithAudit<Whitelist>> => {
    const whitelistCollection = await getCollection<WithAudit<Whitelist>>(WHITELIST_COLLECTION);
    const current = await whitelistCollection.findOne({ ip: whitelist.ip });

    if (current) {
        throw new BadRequestError(400, `Whitelist [ip='${whitelist.ip}'] is already exist`);
    }

    const insertOneResult: InsertOneResult<WithAudit<Whitelist>> = await whitelistCollection.insertOne(whitelist);
    const { _id, ...rest } = whitelist;
    return { id: insertOneResult.insertedId, ...rest };
}

export const update = async ({ _id, ...rest }: Update<Whitelist>): Promise<UpdateResult> => {
    const whitelistCollection = await getCollection<Whitelist>(WHITELIST_COLLECTION);
    return await whitelistCollection.updateOne({ _id }, { $set: rest });
}

export const deleteById = async (id: string): Promise<DeleteResult> => {
    if (!ObjectId.isValid(id)) {
        return { acknowledged: false, deletedCount: 0 };
    }

    const whitelistCollection = await getCollection<Whitelist>(WHITELIST_COLLECTION);
    return await whitelistCollection.deleteOne({ _id: new ObjectId(id) });
}