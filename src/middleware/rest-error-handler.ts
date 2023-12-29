import { ErrorRequestHandler } from "express";
import { MongoServerError } from "mongodb";
import { logger } from "../configs/winston";

export const restErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    try {
        console.error(err);
        logger.error(err);

        if (err instanceof MongoServerError) {
            const mongoServerError = err as MongoServerError;

            if (mongoServerError.errInfo?.details?.schemaRulesNotSatisfied) {
                console.error(mongoServerError.errInfo?.details?.schemaRulesNotSatisfied);
                logger.error(mongoServerError.errInfo?.details?.schemaRulesNotSatisfied);
                return res.status(400).json(mongoServerError.errInfo?.details?.schemaRulesNotSatisfied);
                
            } else if (mongoServerError.code === 11000) {
                let message = err.message;
                let result = mongoServerError.errmsg.match(new RegExp('dup key: {' + "(.*)" + ':'));

                if (result && result.length >= 2 && result[1]) {
                    message = "Duplicate" + result[1];
                }

                return res.status(409).json({ message });
            }
        } else {
            res.status(err.status || 500);
            res.json({ "message": err.message });
        }
    } catch (error) {
        console.error(error);
        logger.error(error);

        res.status(err.status || 500);
        res.json({ "message": err.message });
    }
};
