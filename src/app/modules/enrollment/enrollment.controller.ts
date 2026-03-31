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

const getEnrollmentsByLearnerId = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const result = await EnrollmentService.getEnrollmentsByLearnerId(user);
    sendResponse(res, {
      success: true,
      httpStatusCode: status.OK,
      message: 'Enrollments retrieved successfully',
      data: result,
    });
  },
);

const getEnrollmentById = catchAsync(async (req: Request, res: Response) => {
  const enrollment_id = req.params.enrollment_id as string;
  const result = await EnrollmentService.getEnrollmentById(enrollment_id);
  if (!result) {
    sendResponse(res, {
      success: false,
      httpStatusCode: status.NOT_FOUND,
      message: 'Enrollment not found',
    });
    return;
  }
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Enrollment retrieved successfully',
    data: result,
  });
});

const getAllEnrollments = catchAsync(async (req: Request, res: Response) => {
  const result = await EnrollmentService.getAllEnrollments();
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Enrollments successfully',
    data: result,
  });
});

export const EnrollmentController = {
  enrollCourse,
  getEnrollmentsByLearnerId,
  getEnrollmentById,
  getAllEnrollments,
};
