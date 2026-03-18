import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './app/middleware/globalErrorHanlder';

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(globalErrorHandler);

export default app;
