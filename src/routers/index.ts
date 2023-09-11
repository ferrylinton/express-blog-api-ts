import { Express } from 'express';
import authRouter from './auth-router';
import indexRouter from './index-router';
import todoRouter from './todo-router';
import whitelistRouter from './whitelist-router';
import authorityRouter from './authority-router';
import userRouter from './user-router';
import imageRouter from './image-router';


export default function setRoutes(app: Express) {
    app.use('/', indexRouter);
    app.use('/auth', authRouter);
    app.use('/api/todoes', todoRouter);
    app.use('/api/users', userRouter);
    app.use('/api/authorities', authorityRouter);
    app.use('/api/whitelists', whitelistRouter);
    app.use('/api/images', imageRouter);
}