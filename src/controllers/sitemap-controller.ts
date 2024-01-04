import { NextFunction, Request, Response } from 'express';
import * as sitemapService from '../services/sitemap-service';


export async function find(req: Request, res: Response, next: NextFunction) {
    try {
        const urls = await sitemapService.find();
        res.status(200).json(urls);
    } catch (error) {
        next(error);
    }
};

