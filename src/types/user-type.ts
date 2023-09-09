type User = {
    id?: string,
    username: string,
    password: string,
    email: string,
    loginAttempt: number,
    activated: boolean,
    locked: boolean,
    authorities: string[],
    createdAt: Date,
    updatedAt: Date
}

type UserUpdate = {
    password?: string,
    loginAttempt?: number,
    activated?: boolean,
    locked?: boolean,
    authorities?: string[]
}