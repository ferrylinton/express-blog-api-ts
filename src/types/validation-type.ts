import { ZodError, ZodIssue } from "zod"

export type ValidationError = {
    [key: string]: Partial<ZodIssue>
}