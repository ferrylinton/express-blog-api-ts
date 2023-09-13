import { ClientData } from "./client-data-type";
import { Language } from "./language-type";

export type AuthData = {
    username?: string,
    authorities?: string[],
    language?: Language;
} & ClientData