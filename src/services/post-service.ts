import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { POST_COLLECTION } from "../configs/db-constant";
import { getCollection } from "../configs/mongodb";
import { PAGE_SIZE } from "../configs/pagination-constant";
import { logger } from "../configs/winston";
import { Create, Pageable, Update, WithAudit } from "../types/common-type";
import { Post } from "../types/post-type";


export const find = async (keyword: string, page: number) => {
    const postCollection = await getCollection(POST_COLLECTION);
    const regex = new RegExp(keyword, 'i');

    const pipeline = [
        {
            '$match': {
                '$or': [
                    { 'title.id': regex },
                    { 'title.en': regex },
                    { 'description.id': regex },
                    { 'description.en': regex },
                    { 'content.id': regex },
                    { 'content.en': regex }
                ]
            }
        },
        {
            '$project': {
                'content': 0
            }
        }, {
            '$sort': {
                'title': 1
            }
        }, {
            '$facet': {
                'data': [
                    {
                        '$skip': (page - 1) * PAGE_SIZE
                    }, {
                        '$limit': PAGE_SIZE
                    }
                ],
                'pagination': [
                    {
                        '$count': 'total'
                    }
                ]
            }
        }, {
            '$unwind': '$pagination'
        }
    ];

    if (!keyword || keyword.trim().length < 3) {
        pipeline.shift();
        logger.info('POST.find : ' + JSON.stringify(pipeline));
    } else {
        logger.info('POST.find : ' + JSON.stringify(pipeline).replaceAll('{}', regex.toString()));
    }

    const arr = await postCollection.aggregate<Pageable<Omit<Post, "content">>>(pipeline).toArray();
    if (arr.length) {
        if (keyword && keyword.trim().length > 2) {
            arr[0].keyword = keyword;
        }

        arr[0].pagination.page = page;
        arr[0].pagination.pageSize = PAGE_SIZE;
        return arr[0];
    }

    return null;
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