import { ClientData } from "./client-data-type";
import { Language } from "./language-type";

export type AuthData = {
    username?: string,
    ttl?: number,
    authorities?: string[],
    language?: Language;
} & ClientData