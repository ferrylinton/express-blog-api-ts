type User = {
    username: string,
    password: string,
    email: string,
    loginAttempt: number,
    activated: boolean,
    locked: boolean,
    authorities: string[]
}