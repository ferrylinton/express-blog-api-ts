import { object, string } from 'zod';

export const CreateTagSchema = object({
    name: string({ required_error: "name.required" })
        .min(3, { message: "name.invalid" })
        .max(30, { message: "name.invalid" }),

    description: object({
        id: string({ required_error: "description.id.required" })
            .min(10, { message: "description.id.invalid" })
            .max(200, { message: "description.id.invalid" }),
        en: string({ required_error: "description.en.required" })
            .min(10, { message: "description.en.invalid" })
            .max(200, { message: "description.en.invalid" })
    }),

    logo: string({ required_error: "logo.required" })
        .min(20, { message: "logo.invalid" })
        .max(200, { message: "logo.invalid" })
});

export const UpdateTagSchema = CreateTagSchema.partial();
