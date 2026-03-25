import { Request, Response } from 'express';
import { catchAsync } from '../../../sharedFunction/catchAsync';
import { EnrollmentService } from './enrollment.service';
import { sendResponse } from '../../../sharedFunction/sendResponse';
import status from 'http-status';

const enrollCourse = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const course_id = req.params.course_id as string;

  const result = await EnrollmentService.enrollCourse(user, course_id);

  if (typeof result === 'string') {
    sendResponse(res, {
      success: true,
      httpStatusCode: status.OK,
      message: 'Please, Complete your payment',
      data: {
        url: result,
      },
    });
  } else {
    sendResponse(res, {
      success: true,
      httpStatusCode: status.OK,
      message: 'Enrolled successfully',
      data: result,
    });
  }
});

export const EnrollmentController = {
  enrollCourse,
};
