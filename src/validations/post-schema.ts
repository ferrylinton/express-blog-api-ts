import { object, string } from 'zod';

export const CreatePostSchema = object({

    slug: string({ required_error: "slug.required" })
        .min(3, { message: "slug.invalid" })
        .max(100, { message: "slug.invalid" }),

    title: object({
        id: string({ required_error: "title.id.required" })
            .min(3, { message: "title.id.invalid" })
            .max(150, { message: "title.id.invalid" }),
        en: string({ required_error: "title.en.required" })
            .min(3, { message: "title.en.invalid" })
            .max(150, { message: "title.en.invalid" })
    }),

    description: object({
        id: string({ required_error: "description.id.required" })
            .min(3, { message: "description.id.invalid" })
            .max(250, { message: "description.id.invalid" }),
        en: string({ required_error: "description.en.required" })
            .min(3, { message: "description.en.invalid" })
            .max(250, { message: "description.en.invalid" }),
    }),

    content: object({
        id: string({ required_error: "content.id.required" })
            .min(3, { message: "content.id.invalid" }),
        en: string({ required_error: "content.en.required" })
            .min(3, { message: "content.en.invalid" }),
    }),

    tags: string().array().nonempty({
        message: "tags.empty"
    })

});

export const UpdatePostSchema = CreatePostSchema.partial();
