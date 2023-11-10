import { object, string } from 'zod';

export const CreatePostSchema = object({

    slug: string().min(3).max(100),

    title: object({
        id: string().min(3).max(150),
        en: string().min(3).max(150)
    }),

    description: object({
        id: string().min(3).max(500),
        en: string().min(3).max(500),
    }),

    content: object({
        id: string().min(3),
        en: string().min(3),
    }),

    tags: string().array().nonempty()

});

export const UpdatePostSchema = CreatePostSchema.partial();
