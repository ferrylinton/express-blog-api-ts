import { InsertOneResult } from "mongodb";
import { POST_LOG_COLLECTION } from "../configs/db-constant";
import { getCollection } from "../configs/mongodb";
import { PostLog } from "../types/post-log-type";


export const create = async (slug: string, clientIp: string, userAgent: string): Promise<PostLog> => {
    const postLogCollection = await getCollection<PostLog>(POST_LOG_COLLECTION);
    const createdAt = new Date();
    const insertOneResult: InsertOneResult<PostLog> = await postLogCollection.insertOne({ slug, clientIp, userAgent, createdAt });
    return { id: insertOneResult.insertedId, slug, clientIp, userAgent, createdAt };
}
