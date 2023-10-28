import { object, string } from 'zod';

export const CreateAuthoritySchema = object({

    code: string()
        .min(3)
        .max(5),

    description: string()
        .min(10)
        .max(100)

});

export const UpdateAuthoritySchema = CreateAuthoritySchema.partial();
