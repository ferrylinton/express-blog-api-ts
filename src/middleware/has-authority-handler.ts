import { NextFunction, Request, Response } from 'express';
import { AuthData } from '../types/auth-data-type';


export const hasAuthority = (authorities: string[]) => (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.auth && checkHasAuthority(authorities, req.auth)) {
            next();
        } else {
            res.status(403).json({ message: "Forbidden" });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

const checkHasAuthority = (authorities: string[], authData: AuthData) => {
    for (let i = 0; i < authorities.length; i++) {
        if (authData.authorities?.includes(authorities[i])) {
            return true;
        }
    }

    return false;
}

