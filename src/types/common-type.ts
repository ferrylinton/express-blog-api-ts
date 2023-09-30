import { ObjectId } from "mongodb";

export type WithAudit<T> = {
    id?: ObjectId,
    _id?: ObjectId,
    createdBy: string,
    updatedBy?: string,
    createdAt: Date,
    updatedAt?: Date
} & T;

export type Create<T> = {
    id?: ObjectId,
    _id?: ObjectId,
    createdBy: string,
    createdAt: Date
} & T;

export type Update<T> = {
    _id: ObjectId,
    updatedBy: string,
    updatedAt: Date
} & Partial<T>;

export type Pageable<T> = {
    data: Array<WithAudit<T>>,
    pagination: {
        total: number,
        page?: number,
        pageSize?: number
    },
    keyword?: string,
    tag?: string
}
