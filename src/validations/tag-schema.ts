import { object, string } from 'zod';

export const CreateTagSchema = object({
    name: string()
        .min(3)
        .max(30)
});

export const UpdateTagSchema = CreateTagSchema.partial();
