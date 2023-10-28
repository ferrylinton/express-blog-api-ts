import { ErrorRequestHandler } from "express";
import { MongoServerError } from "mongodb";
import { logger } from "../configs/winston";

export const restErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    logger.error(err);
    
    if (err instanceof MongoServerError) {
        const mongoServerError = err as MongoServerError;

        if (mongoServerError.code === 11000) {
            let message = err.message;
            let result = mongoServerError.errmsg.match(new RegExp('dup key: {' + "(.*)" + ':'));

            if (result && result.length >= 2 && result[1]) {
                message = "Duplicate" + result[1];
            }

            return res.status(409).json({ message });
        }
    }

    res.status(err.status || 500);
    res.json({ "message": err.message });
};
