import { ObjectId, WithId } from "mongodb";
import { getCollection } from "../configs/mongodb";
import { WHITELIST_COLLECTION } from "../db/schemas/whitelist-schema";

const whitelistCache = new Set<string>();

export const getWhitelist = async () => {
    if(whitelistCache.size === 0){
        await reload();
    }

    return whitelistCache;
}

export const reload = async (): Promise<void> => {
    const whitelistsCollection = await getCollection<{ ip: string }>(WHITELIST_COLLECTION);
    const cursor = whitelistsCollection.find({}, {
        projection: { _id: 0, ip: 1, createdAt: 1 },
    });

    whitelistCache.clear()
    for await (const doc of cursor) {
        const { ip } = doc;
        whitelistCache.add(ip)
    }
}

export const find = async (): Promise<Whitelist[]> => {
    const whitelists: Whitelist[] = [];
    const whitelistsCollection = await getCollection<Whitelist>(WHITELIST_COLLECTION);
    const cursor = whitelistsCollection.find();

    whitelistCache.clear()
    for await (const doc of cursor) {
        const { _id, ip, createdAt } = doc;
        const id = _id.toHexString();
        whitelists.push({ id, ip, createdAt });
        whitelistCache.add(ip)
    }

    return whitelists;
}

export const findById = async (_id: ObjectId) => {
    const whitelistsCollection = await getCollection<Whitelist>(WHITELIST_COLLECTION);
    const whitelist = await whitelistsCollection.findOne({ _id });

    if (whitelist) {
        const { _id, ...other } = whitelist;
        return { id: _id.toHexString(), ...other };
    } else {
        return whitelist;
    }
}

export const create = async (ip: string) => {
    const whitelistsCollection = await getCollection<Whitelist>(WHITELIST_COLLECTION);

    const now = new Date();
    const whitelist: Whitelist = {
        ip,
        createdAt: now
    }

    const { insertedId: id } = await whitelistsCollection.insertOne(whitelist);
    const { _id, ...other } = whitelist as WithId<Whitelist>;
    return { id, ...other };
}

export const createMany = async (ips: string[]) => {
    const whitelistsCollection = await getCollection<Whitelist>(WHITELIST_COLLECTION);

    const now = new Date();
    const data = ips.map(ip => {
        return {
            ip, createdAt: now
        }
    })

    return await whitelistsCollection.insertMany(data);
}

export const deleteById = async (_id: ObjectId) => {
    const whitelistsCollection = await getCollection<Whitelist>(WHITELIST_COLLECTION);
    return await whitelistsCollection.deleteOne({ _id });
}