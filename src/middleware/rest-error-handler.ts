import { ErrorRequestHandler } from "express";
import { mongodbErrorHandler } from "./mongodb-error-handle";

export const restErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    mongodbErrorHandler(err, req, res, next);
    
    res.status(err.status || 500);
    res.json({ "message": err.message });
};
