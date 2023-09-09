import bcrypt from 'bcrypt';
import { ObjectId, WithId } from "mongodb";
import { getCollection } from "../configs/mongodb";
import { USER_COLLECTION } from "../db/schemas/user-schema";
import { BASIC } from '../configs/auth-constant';


export const find = async (): Promise<User[]> => {
    const usersCollection = await getCollection<User>(USER_COLLECTION);
    const cursor = usersCollection.find().limit(10).sort({ 'createdAt': -1 });

    const users: User[] = [];

    for await (const doc of cursor) {
        const { _id, ...other } = doc;
        const id = _id.toHexString();
        users.push({ id, ...other });
    }

    return users;
}

export const findById = async (_id: ObjectId) => {
    const usersCollection = await getCollection<User>(USER_COLLECTION);
    const user = await usersCollection.findOne({ _id });

    if (user) {
        const { _id, ...other } = user;
        return { id: _id.toHexString(), ...other };
    } else {
        return user;
    }
}

export const findByUsername = async (username: string) => {
    const usersCollection = await getCollection<User>(USER_COLLECTION);
    const user = await usersCollection.findOne({ username });

    if (user) {
        const { _id, ...other } = user;
        return { id: _id.toHexString(), ...other };
    }

    return null;
}

export const create = async (username: string, password: string, email: string, authorities: string[] = [BASIC]) => {
    const usersCollection = await getCollection<User>(USER_COLLECTION);

    password = bcrypt.hashSync(password, 10);
    const now = new Date();
    const user: User = {
        username,
        password,
        email,
        activated: false,
        locked: false,
        loginAttempt: 0,
        authorities,
        createdAt: now,
        updatedAt: now
    }

    const { insertedId: id } = await usersCollection.insertOne(user);
    const { _id, ...other } = user as WithId<User>;
    return { id, ...other };
}

export const update = async (_id: ObjectId, userUpdate: UserUpdate) => {
    const usersCollection = await getCollection<User>(USER_COLLECTION);

    const data: Partial<User> = {
        updatedAt: new Date()
    }

    if (userUpdate.password) {
        data.password = bcrypt.hashSync(userUpdate.password, 10);
    }

    if (userUpdate.loginAttempt) {
        data.loginAttempt = userUpdate.loginAttempt;
    }

    if (userUpdate.activated) {
        data.activated = userUpdate.activated;
    }

    if (userUpdate.locked) {
        data.locked = userUpdate.locked;
    }

    if (userUpdate.authorities) {
        data.authorities = userUpdate.authorities;
    }

    return await usersCollection.updateOne({ _id }, { $set: data });
}

export const deleteById = async (_id: ObjectId) => {
    const usersCollection = await getCollection<User>(USER_COLLECTION);
    return await usersCollection.deleteOne({ _id });
}