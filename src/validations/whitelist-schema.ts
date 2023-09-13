import { object, string } from 'zod';

export const CreateWhitelistSchema = object({

    ip: string({ required_error: "ip.required" })
        .min(3, { message: "ip.invalid" })
        .max(20, { message: "ip.invalid" }),

    description: string({ required_error: "description.required" })
        .min(10, { message: "description.invalid" })
        .max(100, { message: "description.invalid" })

});

export const UpdateWhitelistSchema = CreateWhitelistSchema.partial();
