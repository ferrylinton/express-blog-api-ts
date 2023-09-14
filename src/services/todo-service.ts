import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { getCollection } from "../configs/mongodb";
import { TODO_COLLECTION } from "../configs/db-constant";
import { BadRequestError } from "../errors/badrequest-error";
import { Create, Update, WithAudit } from "../types/common-type";
import { Todo } from "../types/todo-type";



export const find = async (): Promise<Array<WithAudit<Todo>>> => {
    const todoCollection = await getCollection<WithAudit<Todo>>(TODO_COLLECTION);
    const cursor = todoCollection.find().sort({ 'name': -1 });

    const todos: Array<WithAudit<Todo>> = [];
    for await (const doc of cursor) {
        const { _id, ...rest } = doc;
        todos.push({ id: _id, ...rest });
    }

    return todos;
}

export const findById = async (id: string): Promise<WithAudit<Todo> | null> => {
    if (!ObjectId.isValid(id)) {
        return null;
    }

    const todoCollection = await getCollection<WithAudit<Todo>>(TODO_COLLECTION);
    const todo = await todoCollection.findOne({ _id: new ObjectId(id) });

    if (todo) {
        const { _id, ...rest } = todo;
        return { id: _id, ...rest };
    }

    return null;
}

export const create = async (todo: Create<Todo>): Promise<WithAudit<Todo>> => {
    const todoCollection = await getCollection<WithAudit<Todo>>(TODO_COLLECTION);
    const current = await todoCollection.findOne({ name: todo.task });

    if (current) {
        throw new BadRequestError(400, `Todo [task='${todo.task}'] is already exist`);
    }

    const insertOneResult: InsertOneResult<WithAudit<Todo>> = await todoCollection.insertOne(todo);
    const { _id, ...rest } = todo;
    return { id: insertOneResult.insertedId, ...rest };
}

export const update = async ({ _id, ...rest }: Update<Todo>): Promise<UpdateResult> => {
    const todoCollection = await getCollection<Todo>(TODO_COLLECTION);
    return await todoCollection.updateOne({ _id }, { $set: rest });
}

export const updateByOwner = async (owner: string, { _id, ...rest }: Update<Todo>): Promise<UpdateResult> => {
    const todoCollection = await getCollection<Todo>(TODO_COLLECTION);
    return await todoCollection.updateOne({ owner, _id }, { $set: rest });
}

export const deleteById = async (_id: ObjectId): Promise<DeleteResult> => {
    const todoCollection = await getCollection<Todo>(TODO_COLLECTION);
    return await todoCollection.deleteOne({ _id });
}

export const deleteByOwnerAndId = async (owner: string, _id: ObjectId): Promise<DeleteResult> => {
    const todoCollection = await getCollection<Todo>(TODO_COLLECTION);
    return await todoCollection.deleteOne({ owner, _id });
}