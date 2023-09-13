import { AuthData } from "../auth-data-type"
import { ClientData } from "../client-data-type"

// to make the file a module and avoid the TypeScript error
export { }

declare global {
    namespace Express {
        export interface Request {
            auth: AuthData,
            client: ClientData
        }
    }
}

