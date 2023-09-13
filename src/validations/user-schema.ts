import { boolean, number, object, string } from 'zod';

const UserSchema = object({

    username: string({ required_error: "username.required" })
        .min(3, { message: "username.invalid" })
        .max(100, { message: "username.invalid" }),

    email: string({ required_error: 'email.required' })
        .max(50, { message: "email.invalid" })
        .email('email.invalid'),

    password: string({ required_error: 'password.required' })
        .min(6, 'password.invalid')
        .max(30, 'password.invalid'),
        
    passwordConfirm: string({ required_error: 'passwordConfirm.requried' })
        .nonempty({ message: 'passwordConfirm.requried' }),

    activated: boolean({ required_error: 'activated.requried' }),

    locked: boolean({ required_error: 'locked.requried' }),

    loginAttempt: number({ required_error: 'loginAttempt.requried' }),

    authorities: string().array().nonempty({
        message: "authorities.empty"
    })

})

export const CreateUserSchema = UserSchema
.refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'password.notMatch',
});

export const UpdateUserSchema = UserSchema.partial();
