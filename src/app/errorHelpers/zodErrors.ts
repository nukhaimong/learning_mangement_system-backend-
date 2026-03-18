import z from 'zod';
import { TErrorResponse, TErrorSources } from '../interfaces/errorInterface';
import status from 'http-status';

export const handlerZodError = (err: z.ZodError): TErrorResponse => {
  const statusCode = status.BAD_REQUEST;
  const message = 'Zod validation Error';
  const errorSources: TErrorSources[] = [];

  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join('=>'),
      message: issue.message,
    });
  });
  return {
    statusCode,
    message,
    errorSources,
    success: false,
  };
};
