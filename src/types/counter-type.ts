import { ObjectId } from "mongodb"

export type Counter = {
    id?: ObjectId,
    _id?: ObjectId,
    slug: string,
    count: number
}