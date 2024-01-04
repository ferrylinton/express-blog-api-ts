import { Express } from 'express';
import authRouter from './auth-router';
import indexRouter from './index-router';
import todoRouter from './todo-router';
import whitelistRouter from './whitelist-router';
import authorityRouter from './authority-router';
import userRouter from './user-router';
import imageRouter from './image-router';
import tagRouter from './tag-router';
import postRouter from './post-router';
import sitemapRouter from './sitemap-router';


export default function setRoutes(app: Express) {
    app.use('/', indexRouter);
    app.use('/auth', authRouter);
    app.use('/api/todoes', todoRouter);
    app.use('/api/users', userRouter);
    app.use('/api/authorities', authorityRouter);
    app.use('/api/whitelists', whitelistRouter);
    app.use('/api/images', imageRouter);
    app.use('/api/tags', tagRouter);
    app.use('/api/posts', postRouter);
    app.use('/api/sitemaps', sitemapRouter);
}