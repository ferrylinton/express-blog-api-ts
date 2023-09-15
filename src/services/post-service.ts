import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { getCollection } from "../configs/mongodb";
import { POST_COLLECTION } from "../configs/db-constant";
import { BadRequestError } from "../errors/badrequest-error";
import { Create, Update, WithAudit } from "../types/common-type";
import { Post } from "../types/post-type";



export const find = async (): Promise<Array<WithAudit<Post>>> => {
    const postCollection = await getCollection<WithAudit<Post>>(POST_COLLECTION);
    const cursor = postCollection.find().sort({ 'name': -1 });

    const posts: Array<WithAudit<Post>> = [];
    for await (const doc of cursor) {
        const { _id, ...rest } = doc;
        posts.push({ id: _id, ...rest });
    }

    return posts;
}

export const findById = async (id: string): Promise<WithAudit<Post> | null> => {
    if (!ObjectId.isValid(id)) {
        return null;
    }

    const postCollection = await getCollection<WithAudit<Post>>(POST_COLLECTION);
    const post = await postCollection.findOne({ _id: new ObjectId(id) });

    if (post) {
        const { _id, ...rest } = post;
        return { id: _id, ...rest };
    }

    return null;
}

export const create = async (post: Create<Post>): Promise<WithAudit<Post>> => {
    const postCollection = await getCollection<WithAudit<Post>>(POST_COLLECTION);
    const insertOneResult: InsertOneResult<WithAudit<Post>> = await postCollection.insertOne(post);
    const { _id, ...rest } = post;
    return { id: insertOneResult.insertedId, ...rest };
}

export const update = async ({ _id, ...rest }: Update<Post>): Promise<UpdateResult> => {
    const postCollection = await getCollection<Post>(POST_COLLECTION);
    return await postCollection.updateOne({ _id }, { $set: rest });
}

export const updateByOwner = async (owner: string, { _id, ...rest }: Update<Post>): Promise<UpdateResult> => {
    const postCollection = await getCollection<Post>(POST_COLLECTION);
    return await postCollection.updateOne({ _id, createdBy: owner }, { $set: rest });
}

export const deleteById = async (_id: ObjectId): Promise<DeleteResult> => {
    const postCollection = await getCollection<Post>(POST_COLLECTION);
    return await postCollection.deleteOne({ _id });
}

export const deleteByOwnerAndId = async (owner: string, _id: ObjectId): Promise<DeleteResult> => {
    const postCollection = await getCollection<Post>(POST_COLLECTION);
    return await postCollection.deleteOne({ _id, createdBy: owner });
}