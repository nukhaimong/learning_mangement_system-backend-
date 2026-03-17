import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import { auth } from './app/lib/auth';
import { toNodeHandler } from 'better-auth/node';

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.all('/api/auth/{*any}', toNodeHandler(auth));

export default app;
