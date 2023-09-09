import { ErrorRequestHandler } from "express";

export const restErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ "message": err.message });
};