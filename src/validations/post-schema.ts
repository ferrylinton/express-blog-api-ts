import { object, string } from 'zod';

export const CreatePostSchema = object({

    slug: string({ required_error: "slug.required" })
        .min(3, { message: "slug.invalid" })
        .max(100, { message: "slug.invalid" }),

    title: string({ required_error: "title.required" })
        .min(3, { message: "title.invalid" })
        .max(150, { message: "title.invalid" }),

    description: string({ required_error: "description.required" })
        .min(3, { message: "description.invalid" })
        .max(250, { message: "description.invalid" }),

    content: string({ required_error: "content.required" })
        .min(3, { message: "content.invalid" }),

    tags: string().array().nonempty({
        message: "tags.empty"
    }),

    createdBy: string({ required_error: "createdBy.required" })

});

export const UpdatePostSchema = CreatePostSchema.partial();
