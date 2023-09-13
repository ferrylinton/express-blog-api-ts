import { object, string } from 'zod';

export const CreateAuthoritySchema = object({
    
    code: string({ required_error: "code.required" })
        .min(3, { message: "code.invalid" })
        .max(5, { message: "code.invalid" }),

    description: string({ required_error: "description.required" })
        .min(10, { message: "description.invalid" })
        .max(100, { message: "description.invalid" })

});

export const UpdateAuthoritySchema = CreateAuthoritySchema.partial();
