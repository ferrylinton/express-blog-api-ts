import { object, string } from 'zod';

export const CreateTagSchema = object({
    name: string({ required_error: "name.required" })
        .min(3, { message: "name.invalid" })
        .max(30, { message: "name.invalid" }),

    description: string({ required_error: "description.required" })
        .min(10, { message: "description.invalid" })
        .max(200, { message: "description.invalid" }),

    logo: string({ required_error: "logo.required" })
        .min(20, { message: "logo.invalid" })
        .max(200, { message: "logo.invalid" })
});

export const UpdateTagSchema = CreateTagSchema.partial();
