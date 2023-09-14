import { object, string } from 'zod';

export const CreateTodoSchema = object({
    task: string({ required_error: "task.required" })
        .min(3, { message: "task.invalid" })
        .max(30, { message: "task.invalid" })

});

