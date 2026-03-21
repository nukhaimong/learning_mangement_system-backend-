import { NextFunction, Request, Response } from 'express';
import z from 'zod';

export const validateRequest = (zodSchema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
      return next(new Error('Request Body Is Missing'));
    }

    if (req.body?.data) {
      req.body = JSON.parse(req.body.parse);
    }

    const parsedRequstData = zodSchema.safeParse(req.body);

    if (!parsedRequstData.success) {
      return next(parsedRequstData.error);
    }

    req.body = parsedRequstData.data;
    next();
  };
};
