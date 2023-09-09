import { NextFunction, Request, Response } from 'express';


export const hasAuthority = (authority: string) => (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.auth && req.auth.authorities?.includes(authority)) {
            next();
        } else {
            res.status(403).json({ message: "Forbidden" });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

