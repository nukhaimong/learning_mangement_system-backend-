import express, { Application } from 'express';
import cookieParser from 'cookie-parser';

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

export default app;
