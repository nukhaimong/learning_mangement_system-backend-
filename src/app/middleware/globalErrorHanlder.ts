import { NextFunction, Request, Response } from 'express';
import { envVars } from '../../config/env';
import AppError from '../errorHelpers/appError';
import { TErrorResponse, TErrorSources } from '../interfaces/errorInterface';
import status from 'http-status';
import z from 'zod';
import { handlerZodError } from '../errorHelpers/zodErrors';
import { deleteUploadedFilesFromGlobalErrorHanlder } from '../utils/deleteUploadedFiles';

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (envVars.NODE_ENV === 'development') {
    console.log('Error comming from global error handler: ', err);
  }

  await deleteUploadedFilesFromGlobalErrorHanlder(req);

  let errorSources: TErrorSources[] = [];
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = 'Internal Server Error';
  let stack: string | undefined = undefined;

  if (err instanceof z.ZodError) {
    const simplifiedError = handlerZodError(err);
    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message;
    stack = simplifiedError.stack;
    errorSources = [...simplifiedError.errorSources];
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [{ path: '', message: err.message }];
  } else if (err instanceof Error) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [{ path: '', message: err.message }];
  }

  const errorResponse: TErrorResponse = {
    success: false,
    message,
    errorSources,
    stack: envVars.NODE_ENV === 'development' ? stack : undefined,
    error: envVars.NODE_ENV === 'development' ? err : undefined,
  };
  res.status(statusCode).json(errorResponse);
};
