import { Request, Response } from 'express';
import { catchAsync } from '../../../sharedFunction/catchAsync';
import { LectureService } from './lecture.service';
import { sendResponse } from '../../../sharedFunction/sendResponse';
import status from 'http-status';

const createLecture = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const payload = {
    ...req.body,
    ...(req.file?.path && { video_url: req.file?.path }),
  };

  const result = await LectureService.createLecture(user, payload);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.CREATED,
    message: 'Lecture created successfully',
    data: result,
  });
});

const insertLecture = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const payload = {
    ...req.body,
    ...(req.file?.path && { video_url: req.file.path }),
  };
  const lecture_id = req.params.lecture_id as string;

  console.log('Call come here');

  console.log('video_url: ', req.file);

  const result = await LectureService.insertLecture(user, payload, lecture_id);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.CREATED,
    message: 'Lecture inserted successfully',
    data: result,
  });
});

const updateLecture = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const payload = {
    ...req.body,
    ...(req.file?.path && { video_url: req.file?.path }),
  };
  const lecture_id = req.params.lecture_id as string;

  const result = await LectureService.updateLecture(user, payload, lecture_id);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Lecture updated successfully',
    data: result,
  });
});

const deleteLecture = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const lecture_id = req.params.lecture_id as string;

  const result = await LectureService.deleteLecture(user, lecture_id);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Lecture deleted successfully',
    data: result,
  });
});

export const LectureController = {
  createLecture,
  insertLecture,
  updateLecture,
  deleteLecture,
};
