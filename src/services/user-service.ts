import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { getCollection } from "../configs/mongodb";
import { USER_COLLECTION } from "../configs/db-constant";
import { BadRequestError } from '../errors/badrequest-error';
import { Create, Update, WithAudit } from '../types/common-type';
import bcrypt from 'bcrypt';


export const find = async (): Promise<Array<WithAudit<User>>> => {
    const userCollection = await getCollection<WithAudit<User>>(USER_COLLECTION);
    const cursor = userCollection.find().sort({ 'username': -1 });

    const authorities: Array<WithAudit<User>> = [];
    for await (const doc of cursor) {
        const { _id, ...rest } = doc;
        authorities.push({ id: _id, ...rest });
    }

    return authorities;
}

export const findById = async (id: string): Promise<WithAudit<User> | null> => {
    if (!ObjectId.isValid(id)) {
        return null;
    }

    const userCollection = await getCollection<WithAudit<User>>(USER_COLLECTION);
    const user = await userCollection.findOne({ _id: new ObjectId(id) });

    if (user) {
        const { _id, ...rest } = user;
        return { id: _id, ...rest };
    }

    return null;
}

export const create = async (user: Create<User>): Promise<WithAudit<User>> => {
    const userCollection = await getCollection<WithAudit<User>>(USER_COLLECTION);
    const current = await userCollection.findOne({
        "$or": [{
            "username": user.username
        }, {
            "email": user.email
        }]
    });

    if (current) {
        throw new BadRequestError(400, `User [username='${user.username}'] or [email='${user.email}'] is already exist`);
    }

    user.password = bcrypt.hashSync(user.password, 10);
    const insertOneResult: InsertOneResult<WithAudit<User>> = await userCollection.insertOne(user);
    const { _id, ...rest } = user;
    return { id: insertOneResult.insertedId, ...rest };
}

export const update = async ({ _id, ...rest }: Update<User>): Promise<UpdateResult> => {
    const userCollection = await getCollection<User>(USER_COLLECTION);
    return await userCollection.updateOne({ _id }, { $set: rest });
}

export const deleteById = async (id: string): Promise<DeleteResult> => {
    if (!ObjectId.isValid(id)) {
        return { acknowledged: false, deletedCount: 0 };
    }

    const userCollection = await getCollection<User>(USER_COLLECTION);
    return await userCollection.deleteOne({ _id: new ObjectId(id) });
}

export const findByUsername = async (username: string): Promise<WithAudit<User> | null> => {
    const userCollection = await getCollection<WithAudit<User>>(USER_COLLECTION);
    const user = await userCollection.findOne({ username });

    if (user) {
        const { _id, ...rest } = user;
        return { id: _id, ...rest };
    }

    return null;
}