import { Request, Response } from 'express';
import { catchAsync } from '../../../sharedFunction/catchAsync';
import { CourseService } from './course.service';
import { sendResponse } from '../../../sharedFunction/sendResponse';
import status from 'http-status';

const createCourse = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const payload = req.body;

  const result = await CourseService.createCourse(user, payload);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.CREATED,
    message: 'Course created successfully',
    data: result,
  });
});

export const CourseController = {
  createCourse,
};
