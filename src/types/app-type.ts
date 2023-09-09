type Language = 'id' | 'en';

type ClientData = {
    ip?: string,
    browser?: string,
    os?: string
}

type AuthData = {
    username?: string,
    authorities?: string[],
    language?: Language;
} & ClientData

type TokenData = {
    username: string,
    ip: string | null,
    browser: string | undefined,
    os: string | undefined,
    createdAt: number
}