import { boolean, coerce, date, number, object, string, z } from 'zod';

export const CreateUserSchema = object({
    username: string().min(3).max(100),
    email: string().max(50).email(),
    password: string().min(6).max(30),
    passwordConfirm: string().nonempty(),
    activated: boolean().optional().default(true),
    locked: boolean().optional().default(false),
    loginAttempt: coerce.number().min(0).max(3).optional().default(0),
    authorities: string().array().nonempty()

})
    .refine((data) => data.password === data.passwordConfirm, {
        path: ['passwordConfirm'],
        message: 'password.notMatch',
    });

export const ChangePasswordSchema = object({
    username: string().min(3).max(100),
    password: string().min(6).max(30),
    passwordConfirm: string().nonempty(),
    updatedBy: string().optional(),
    updatedAt: date().optional().default(new Date())
})
    .refine((data) => data.password === data.passwordConfirm, {
        path: ['passwordConfirm'],
        message: 'password.notMatch'
    });

export const UpdateUserSchema = object({
    username: string().min(3).max(100),
    email: string().max(50).email(),
    authorities: string().array().nonempty(),
    activated: boolean(),
    locked: boolean(),
    loginAttempt: number()
}).partial();

export type CreateUser = z.infer<typeof CreateUserSchema>;
export type ChangePassword = z.infer<typeof ChangePasswordSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
