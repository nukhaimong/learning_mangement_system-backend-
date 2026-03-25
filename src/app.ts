import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './app/middleware/globalErrorHanlder';
import { notFound } from './app/middleware/notFound';
import { IndexRoutes } from './app/router';
import path from 'path';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './app/lib/auth';
import cors from 'cors';
import { envVars } from './config/env';
import { PaymentController } from './app/modules/payment/payment.controller';

const app: Application = express();

app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  PaymentController.handleStripeWebhookEvent,
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    // exposedHeaders: ['set-cookie'],
  }),
);

app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.resolve(process.cwd(), `src/app/templates`));

app.use('/api/auth', toNodeHandler(auth));

app.use('/api/v1/', IndexRoutes);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
