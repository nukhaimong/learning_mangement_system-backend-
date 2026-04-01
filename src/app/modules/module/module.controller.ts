import { Request, Response } from 'express';
import { catchAsync } from '../../../sharedFunction/catchAsync.js';
import { ModuleService } from './module.service.js';
import { sendResponse } from '../../../sharedFunction/sendResponse.js';
import status from 'http-status';

const createModule = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const payload = req.body;
  const result = await ModuleService.createModule(user, payload);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.CREATED,
    message: 'Module created successfully',
    data: result,
  });
});

const getModulesByCourseId = catchAsync(async (req: Request, res: Response) => {
  const course_id = req.params.course_id as string;
  const result = await ModuleService.getModulesByCourseId(course_id);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Modules retrieved successfully',
    data: result,
  });
});

const insertModule = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const payload = req.body;
  const module_id = req.params.module_id as string;

  const result = await ModuleService.insertModule(user, payload, module_id);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.CREATED,
    message: 'Module inserted successfully',
    data: result,
  });
});

const updateModule = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { title } = req.body;
  const module_id = req.params.module_id as string;

  const result = await ModuleService.updateModule(user, title, module_id);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Module updated successfully',
    data: result,
  });
});

const deleteModule = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const module_id = req.params.module_id as string;

  const result = await ModuleService.deleteModule(user, module_id);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Module deleted successfully',
    data: result,
  });
});

export const ModuleController = {
  createModule,
  insertModule,
  updateModule,
  deleteModule,
  getModulesByCourseId,
};
