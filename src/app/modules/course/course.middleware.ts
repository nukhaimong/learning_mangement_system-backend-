import { NextFunction, Request, Response } from 'express';
import { ICreateCoursePayload } from './course.interface';

export const createCourseMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body?.data) {
    req.body = JSON.parse(req.body.data);
  }
  const payload: ICreateCoursePayload = req.body;

  // const files = req.files as {
  //   [fieldName: string]: Express.Multer.File[] | undefined;
  // };

  const files = req.files as {
    thumbnail: Express.Multer.File[];
    intro_video: Express.Multer.File[];
  };

  const thumbnail = files.thumbnail?.[0].path;
  const intro_video = files.intro_video?.[0].path;

  payload.thumbnail = thumbnail;
  payload.intro_video = intro_video;

  req.body = payload;
  next();
};
