import dotenv from 'dotenv';
dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: string;
  DATABASE_URL: string;
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
  EMAIL_SENDER: {
    EMAIL_SENDER_SMTP_USER: string;
    EMAIL_SENDER_SMTP_PASS: string;
    EMAIL_SENDER_SMTP_HOST: string;
    EMAIL_SENDER_SMTP_PORT: string;
    EMAIL_SENDER_SMTP_FROM: string;
  };
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  FRONTEND_URL: string;
  CLOUDINARY: {
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_CLOUD_API_KEY: string;
    CLOUDINARY_CLOUD_API_SECRET: string;
  };
  STRIPE: {
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_KEY: string;
  };
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVars = [
    'NODE_ENV',
    'PORT',
    'DATABASE_URL',
    'BETTER_AUTH_URL',
    'BETTER_AUTH_SECRET',
    'EMAIL_SENDER_SMTP_USER',
    'EMAIL_SENDER_SMTP_PASS',
    'EMAIL_SENDER_SMTP_HOST',
    'EMAIL_SENDER_SMTP_PORT',
    'EMAIL_SENDER_SMTP_FROM',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'FRONTEND_URL',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_CLOUD_API_KEY',
    'CLOUDINARY_CLOUD_API_SECRET',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_KEY',
  ];

  requiredEnvVars.forEach((variable) => {
    if (!process.env[variable]) {
      throw new Error(
        `Environment variable ${variable} is required but not set in .env file`,
      );
    }
  });

  return {
    NODE_ENV: process.env.NODE_ENV as string,
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    EMAIL_SENDER: {
      EMAIL_SENDER_SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM as string,
      EMAIL_SENDER_SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST as string,
      EMAIL_SENDER_SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS as string,
      EMAIL_SENDER_SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT as string,
      EMAIL_SENDER_SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER as string,
    },
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
      CLOUDINARY_CLOUD_API_KEY: process.env.CLOUDINARY_CLOUD_API_KEY as string,
      CLOUDINARY_CLOUD_API_SECRET: process.env
        .CLOUDINARY_CLOUD_API_SECRET as string,
    },
    STRIPE: {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
      STRIPE_WEBHOOK_KEY: process.env.STRIPE_WEBHOOK_KEY as string,
    },
  };
};

export const envVars = loadEnvVariables();
