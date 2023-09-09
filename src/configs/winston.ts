import appRoot from 'app-root-path';
import { createLogger, format, transports } from 'winston';
import { LOG_FILE, LOG_REQUEST } from './env-constant';
const { combine, timestamp, printf, errors } = format;

const timestampFormat = timestamp({
    format: 'YYYY-MM-DD.HH:mm:ss.SSS'
});

const requestFilter = format((info, opts) => {
    if (info.request)
        return info;
    else
        return false;

});

const appFilter = format((info, opts) => {
    if (info.request)
        return false;
    else
        return info;
});

const customFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
    try {
        if (stack) {
            return `${timestamp} [${level}] ${stack}`;
        } else if (meta && Object.keys(meta).length && !(meta.server || meta.request || meta.mongodb)) {
            return `${timestamp} [${level}] ${message}, ${JSON.stringify(meta)}`;
        } else {
            return `${timestamp} [${level}] ${message}`;
        }
    } catch (error: any) {
        console.error(error);
        return `error on winston, ${error.message}`;
    }
});

export const logger = createLogger({
    format: combine(
        errors({ stack: true })
    ),
    transports: [
        new transports.File({
            level: LOG_FILE,
            filename: `${appRoot}/logs/app.log`,
            handleExceptions: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            format: combine(appFilter(), timestampFormat, customFormat)
        }),
        new transports.File({
            level: LOG_REQUEST,
            filename: `${appRoot}/logs/request.log`,
            handleExceptions: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            format: combine(requestFilter(), timestampFormat, customFormat)
        }),
        new transports.Console({
            level: "debug",
            format: combine(appFilter(), format.colorize(), timestampFormat, customFormat)
        })

    ],
    exitOnError: false
});
