import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { getCollection } from "../configs/mongodb";
import { USER_COLLECTION } from "../configs/db-constant";
import { BadRequestError } from '../errors/badrequest-error';
import { Create, Update, WithAudit } from '../types/common-type';
import bcrypt from 'bcrypt';
import { CreateUser } from "../validations/user-schema";


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

export const create = async ({passwordConfirm, ...createUser}: Create<CreateUser>): Promise<WithAudit<User>> => {
    const userCollection = await getCollection<WithAudit<User>>(USER_COLLECTION);
    const current = await userCollection.findOne({
        "$or": [{
            "username": createUser.username
        }, {
            "email": createUser.email
        }]
    });

    if (current) {
        throw new BadRequestError(400, `User [username='${createUser.username}'] or [email='${createUser.email}'] is already exist`);
    }

    const user: Create<User> = {
        loginAttempt: 0,
        activated: false,
        locked: false,
        ...createUser
    };
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