import { ObjectId } from "mongodb"

export type PostLog = {
    id?: ObjectId,
    _id?: ObjectId,
    slug: string,
    clientIp: string,
    userAgent: string
    createdAt: Date
}