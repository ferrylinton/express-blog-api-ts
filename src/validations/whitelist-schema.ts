import { object, string } from 'zod';

export const CreateWhitelistSchema = object({
    ip: string().min(3).max(20),
    description: string().min(10).max(100)
});

export const UpdateWhitelistSchema = CreateWhitelistSchema.partial();