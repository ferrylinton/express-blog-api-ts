import { UpdateResult } from "mongodb";
import { COUNTER_COLLECTION } from "../configs/db-constant";
import { getCollection } from "../configs/mongodb";
import { WithAudit } from "../types/common-type";
import { Counter } from "../types/counter-type";


export const findBySlug = async (slug: string): Promise<Counter | null> => {
    const counterCollection = await getCollection<WithAudit<Counter>>(COUNTER_COLLECTION);
    const counter = await counterCollection.findOne({ slug });

    if (counter) {
        const { _id, ...rest } = counter;
        return { id: _id, ...rest };
    }

    return null;
}

export const update = async (slug: string): Promise<UpdateResult> => {
    const counterCollection = await getCollection<WithAudit<Counter>>(COUNTER_COLLECTION);
    return await counterCollection.updateOne({ slug }, { $inc: { count: 1 } }, { upsert: true });
}