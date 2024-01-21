import appRoot from 'app-root-path';
import { createLogger, format, transports } from 'winston';
import { LOG_CONSOLE, LOG_FILE, LOG_REQUEST } from './env-constant';
const { combine, timestamp, printf, errors } = format;

const timestampFormat = timestamp({
    format: new Date().toLocaleString('id-ID', {
        timeZone: 'Asia/Bangkok'
    })
});

const requestFilter = format((info, opts) => {
    if (info.request && info.request === true)
        return info;
    else
        return false;

});

const appFilter = format((info, opts) => {
    if (info.request && info.request === true)
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
            maxFiles: 10,
            format: combine(appFilter(), timestampFormat, customFormat)
        }),
        new transports.File({
            level: LOG_REQUEST,
            filename: `${appRoot}/logs/request.log`,
            handleExceptions: true,
            maxsize: 5242880, // 5MB
            maxFiles: 10,
            format: combine(requestFilter(), timestampFormat, customFormat)
        }),
        new transports.Console({
            level: LOG_CONSOLE,
            format: combine(format.colorize(), timestampFormat, customFormat)
        })

    ],
    exitOnError: false
});
