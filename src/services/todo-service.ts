import { ObjectId, WithId } from "mongodb";
import { getCollection } from "../configs/mongodb";
import { TODO_COLLECTION } from "../db/schemas/todo-schema";


export const find = async (): Promise<Todo[]> => {
    const todoes: Todo[] = [];
    const todoesCollection = await getCollection<Todo>(TODO_COLLECTION);
    const cursor = todoesCollection.find().limit(10).sort({ 'createdAt': -1 });

    for await (const doc of cursor) {
        const { _id, ...other } = doc;
        const id = _id.toHexString();
        todoes.push({ id, ...other });
    }

    return todoes;
}

export const findById = async (_id: ObjectId) => {
    const todoesCollection = await getCollection<Todo>(TODO_COLLECTION);
    const todo = await todoesCollection.findOne({ _id });

    if (todo) {
        const { _id, ...other } = todo;
        return { id: _id.toHexString(), ...other };
    } else {
        return todo;
    }
}

export const create = async (task: string) => {
    const todoesCollection = await getCollection<Todo>(TODO_COLLECTION);

    // Insert new data

    const now = new Date();
    const todo: Todo = {
        task,
        done: false,
        createdAt: now,
        updatedAt: now
    }
    const { insertedId: id } = await todoesCollection.insertOne(todo);
    const { _id, ...other } = todo as WithId<Todo>;

    // Delete data if total data > 20

    const count = await todoesCollection.countDocuments();
    if (count > 20) {
        const idDocuments = await todoesCollection
            .find()
            .project({ _id: 1 })
            .limit(count - 20)
            .sort({ createdAt: 1 })
            .toArray();

        
        const ids: ObjectId[] = idDocuments.map(doc => doc._id);
        todoesCollection.deleteMany({ _id: { $in: ids } })
    }

    return { id, ...other };
}

export const update = async (_id: ObjectId, todoUpdate: TodoUpdate) => {
    const todoesCollection = await getCollection<Todo>(TODO_COLLECTION);

    const data: Partial<Todo> = {
        updatedAt: new Date()
    }

    if (todoUpdate.task) {
        data.task = todoUpdate.task;
    }

    if (todoUpdate.done) {
        data.done = todoUpdate.done;
    }

    return await todoesCollection.updateOne({ _id }, { $set: data });
}

export const deleteById = async (_id: ObjectId) => {
    const todoesCollection = await getCollection<Todo>(TODO_COLLECTION);
    return await todoesCollection.deleteOne({ _id });
}