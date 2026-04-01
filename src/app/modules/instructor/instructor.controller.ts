import { Request, Response } from 'express';
import { catchAsync } from '../../../sharedFunction/catchAsync.js';
import { sendResponse } from '../../../sharedFunction/sendResponse.js';
import status from 'http-status';
import { InstructorService } from './instructor.service.js';

const getInstructors = catchAsync(async (req: Request, res: Response) => {
  const result = await InstructorService.getInstructors();
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Instructors retrieved successfully',
    data: result,
  });
});

const getInstructorById = catchAsync(async (req: Request, res: Response) => {
  const instructor_id = req.params.instructor_id as string;
  const result = await InstructorService.getInstructorById(instructor_id);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Instructor retrieved successfully',
    data: result,
  });
});

const updateInstructor = catchAsync(async (req: Request, res: Response) => {
  const instructor_id = req.params.instructor_id as string;

  const user = req.user;

  const payload = {
    ...req.body,
    ...(req.file?.path && { profile_photo: req.file.path }),
  };

  const result = await InstructorService.updateInstructor(
    user,
    instructor_id,
    payload,
  );
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Instructor updated successfully',
    data: result,
  });
});

const deleteInstructor = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const instructor_id = req.params.instructor_id as string;

  const result = await InstructorService.deleteInstructor(user, instructor_id);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Instructor deleted successfully',
    data: result,
  });
});

export const InstructorController = {
  getInstructors,
  getInstructorById,
  updateInstructor,
  deleteInstructor,
};
