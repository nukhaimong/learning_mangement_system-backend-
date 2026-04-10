import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './app/middleware/globalErrorHanlder.js';
import { notFound } from './app/middleware/notFound.js';
import { IndexRoutes } from './app/router/index.js';
import path from 'path';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './app/lib/auth.js';
import cors from 'cors';
import { envVars } from './config/env.js';
import { PaymentController } from './app/modules/payment/payment.controller.js';

const app: Application = express();
app.set('trust proxy', 1);

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
    allowedHeaders: ['Content-Type', 'Cookie', 'Authorization'],
    exposedHeaders: ['set-cookie'],
  }),
);

app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.resolve(process.cwd(), `src/app/templates`));

app.use('/api/auth', toNodeHandler(auth));

app.use('/api/v1/', IndexRoutes);
app.get('/', (req, res) => {
  res.send('api is working yeeyyyyyy');
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
