import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { POST_COLLECTION } from "../configs/db-constant";
import { getCollection } from "../configs/mongodb";
import { PAGE_SIZE } from "../configs/pagination-constant";
import { logger } from "../configs/winston";
import { Create, Pageable, Update, WithAudit } from "../types/common-type";
import { Post } from "../types/post-type";


export const find = async (tag: string | null, keyword: string | null, page: number) => {
    page = page <= 0 ? 1 : page;
    const postCollection = await getCollection(POST_COLLECTION);

    const pipeline = [
        {
            '$match': {}
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

    if (tag && keyword) {
        const regex = new RegExp(keyword, 'i');
        pipeline[0]['$match'] = {
            $and: [
                {
                    tags: { "$in": [tag] }
                },
                {
                    '$or': [
                        { 'title.id': regex },
                        { 'title.en': regex },
                        { 'description.id': regex },
                        { 'description.en': regex },
                        { 'content.id': regex },
                        { 'content.en': regex },
                        { 'createdBy': regex }
                    ]
                }
            ]
        }

        logger.info('POST.find : ' + JSON.stringify(pipeline).replaceAll('{}', regex.toString()));
    } else if (!tag && keyword) {
        const regex = new RegExp(keyword, 'i');
        pipeline[0]['$match'] = {
            '$or': [
                { 'title.id': regex },
                { 'title.en': regex },
                { 'description.id': regex },
                { 'description.en': regex },
                { 'content.id': regex },
                { 'content.en': regex },
                { 'createdBy': regex }
            ]
        }

        logger.info('POST.find : ' + JSON.stringify(pipeline).replaceAll('{}', regex.toString()));
    } else if (tag && !keyword) {
        pipeline[0]['$match'] = {
            tags: { "$in": [tag] }
        }
        logger.info('POST.find : ' + JSON.stringify(pipeline));
    } else {
        pipeline.shift();
        logger.info('POST.find : ' + JSON.stringify(pipeline));
    }

    const arr = await postCollection.aggregate<Pageable<Omit<Post, "content">>>(pipeline).toArray();

    if (arr.length) {
        if (keyword) {
            arr[0].keyword = keyword;
        }

        arr[0].pagination.page = page;
        arr[0].pagination.totalPage = Math.ceil(arr[0].pagination.total / PAGE_SIZE)
        arr[0].pagination.pageSize = PAGE_SIZE;

        arr[0].data = arr[0].data.map(post => {
            const { _id, ...rest } = post;
            return { id: _id, ...rest }
        })

        return arr[0];
    }

    return {
        "data": [],
        "pagination": {
            "total": 0,
            "totalPage": 0,
            "page": 1,
            "pageSize": 10
        },
        keyword,
        tag
    };
}

export const findLatest = async () => {
    const postCollection = await getCollection<WithAudit<Post>>(POST_COLLECTION);
    const cursor = postCollection.find().sort({ createdDate: -1 }).limit(10);

    const posts: Array<WithAudit<Post>> = [];
    
    for await (const doc of cursor) {
        const { _id, ...rest } = doc;
        posts.push({ id: _id, ...rest });
    }

    return posts;
}

export const findById = async (id: string): Promise<WithAudit<Post> | null> => {
    const postCollection = await getCollection<WithAudit<Post>>(POST_COLLECTION);
    const post = await postCollection.findOne({ _id: new ObjectId(id) });

    if (post) {
        const { _id, ...rest } = post;
        return { id: _id, ...rest };
    }

    return null;
}

export const findBySlug = async (slug: string): Promise<WithAudit<Post> | null> => {
    const postCollection = await getCollection<WithAudit<Post>>(POST_COLLECTION);
    const post = await postCollection.findOne({ slug });

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