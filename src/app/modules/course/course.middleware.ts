import { NextFunction, Request, Response } from 'express';
import { ICourseUpdatePayload, ICreateCoursePayload } from './course.interface';
import AppError from '../../errorHelpers/appError';
import status from 'http-status';

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

  const thumbnail = files.thumbnail?.[0]?.path;
  const intro_video = files.intro_video?.[0]?.path;

  if (!thumbnail || !intro_video) {
    throw new AppError(
      status.BAD_REQUEST,
      'Both thumbnail and intro_video are required',
    );
  }

  payload.thumbnail = thumbnail;
  payload.intro_video = intro_video;

  req.body = payload;
  next();
};

export const updateCourseMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body?.data) {
    req.body = JSON.parse(req.body.data);
  }
  const payload: ICourseUpdatePayload = req.body;

  // const files = req.files as {
  //   [fieldName: string]: Express.Multer.File[] | undefined;
  // };

  const files = req.files as {
    thumbnail: Express.Multer.File[];
    intro_video: Express.Multer.File[];
  };

  const thumbnail = files.thumbnail?.[0].path;
  const intro_video = files.intro_video?.[0].path;

  if (thumbnail) {
    payload.thumbnail = thumbnail;
  }
  if (intro_video) {
    payload.intro_video = intro_video;
  }

  req.body = payload;
  next();
};
