import { object, string, TypeOf } from 'zod';

export const AuthenticateSchema = object({
    username: string().min(4),
    password: string().min(4)
});

export type AuthenticateType = TypeOf<typeof AuthenticateSchema>;