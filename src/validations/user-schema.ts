import { boolean, number, object, string, z } from 'zod';

export const CreateUserSchema = object({

    username: string()
        .min(3)
        .max(100),

    email: string()
        .max(50)
        .email(),

    password: string()
        .min(6)
        .max(30),

    passwordConfirm: string().nonempty(),

    authorities: string().array().nonempty()

})
    .refine((data) => data.password === data.passwordConfirm, {
        path: ['passwordConfirm'],
        message: 'password.notMatch',
    });

export const UpdateUserSchema = object({

    username: string()
        .min(3)
        .max(100),

    email: string()
        .max(50)
        .email(),

    password: string()
        .min(6)
        .max(30),

    passwordConfirm: string().nonempty(),

    authorities: string().array().nonempty(),

    activated: boolean(),

    locked: boolean(),

    loginAttempt: number(),

}).partial();

export type CreateUser = z.infer<typeof CreateUserSchema>

export type UpdateUser = z.infer<typeof UpdateUserSchema>
