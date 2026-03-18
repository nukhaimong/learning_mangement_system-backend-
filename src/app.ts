import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './app/middleware/globalErrorHanlder';
import { notFound } from './app/middleware/notFound';
import { IndexRoutes } from './app/router';

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/api/v1/', IndexRoutes);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
