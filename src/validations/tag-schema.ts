import { object, string } from 'zod';

export const CreateTagSchema = object({
    name: string({ required_error: "name.required" })
        .min(3, { message: "name.invalid" })
        .max(30, { message: "name.invalid" })
});

export const UpdateTagSchema = CreateTagSchema.partial();
