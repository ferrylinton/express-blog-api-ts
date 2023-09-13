import { ErrorRequestHandler } from "express";
import { MongoServerError } from "mongodb";
import { logger } from "../configs/winston";

export const mongodbErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    logger.error(err);

    try {
        if (err instanceof MongoServerError) {
            const mongoServerError = err as MongoServerError;
            const regexResult = mongoServerError.message.match(/{([^}]+)}/);
            const message = 'Duplicate data'
            const data = JSON.parse(regexResult ? regexResult[0].replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ') : '');

            res.status(400)
            return res.json({ message, data });
        }
    } catch (error) {
        logger.error(error);
    } finally {
        next();
    }
};
