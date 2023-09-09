type Authority = {
    id?: string,
    code: string,
    description: string,
    createdAt: Date,
    updatedAt: Date
}

type AuthorityUpdate = {
    code?: string,
    description?: string
}