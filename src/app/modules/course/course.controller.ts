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

const getCourses = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.getCourses();
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Courses retrived successfully',
    data: result,
  });
});

const getCourseById = catchAsync(async (req: Request, res: Response) => {
  const course_id = req.params.course_id as string;
  const result = await CourseService.getCourseById(course_id);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Course retrived successfully',
    data: result,
  });
});

const updateCourse = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const course_id = req.params.course_id as string;
  const payload = req.body;
  const result = await CourseService.updateCourse(user, course_id, payload);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Courses updated successfully',
    data: result,
  });
});

const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const course_id = req.params.course_id as string;
  const result = await CourseService.deleteCourse(user, course_id);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Courses deleted successfully',
    data: result,
  });
});

export const CourseController = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
