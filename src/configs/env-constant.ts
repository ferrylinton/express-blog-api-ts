import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

if (!process.env.REDIS_URL && !process.env.REDIS_SOCKET_PATH) {
    throw new Error('Invalid environment variable: "REDIS_URL or REDIS_SOCKET_PATH"')
}

if (!process.env.MONGODB_URL) {
    throw new Error('Invalid environment variable: "MONGODB_URL"')
}

if (!process.env.MONGODB_AUTH_SOURCE) {
    throw new Error('Invalid environment variable: "MONGODB_AUTH_SOURCE"')
}

if (!process.env.MONGODB_USERNAME) {
    throw new Error('Invalid environment variable: "MONGODB_USERNAME"')
}

if (!process.env.MONGODB_PASSWORD) {
    throw new Error('Invalid environment variable: "MONGODB_PASSWORD"')
}

if (!process.env.MONGODB_DATABASE) {
    throw new Error('Invalid environment variable: "MONGODB_DATABASE"')
}

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || '5001';

export const MONGODB_URL = process.env.MONGODB_URL;
export const MONGODB_AUTH_SOURCE = process.env.MONGODB_AUTH_SOURCE;
export const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
export const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
export const MONGODB_DATABASE = process.env.MONGODB_DATABASE;

export const REDIS_URL = process.env.REDIS_URL;
export const REDIS_SOCKET_PATH = process.env.REDIS_SOCKET_PATH;
export const REDIS_PREFIX = process.env.REDIS_PREFIX || 'blogapi';

export const LOG_CONSOLE = process.env.LOG_CONSOLE || 'debug';
export const LOG_FILE = process.env.LOG_FILE || 'warn';
export const LOG_REQUEST = process.env.LOG_REQUEST || 'debug';

export const MARKDOWN_FOLDER = process.env.MARKDOWN_FOLDER || join(process.env.ROOT_DIR || process.cwd(), 'markdown');