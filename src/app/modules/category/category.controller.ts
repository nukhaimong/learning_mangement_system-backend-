import { Request, Response } from 'express';
import { catchAsync } from '../../../sharedFunction/catchAsync';
import { CategoryService } from './category.service';
import { sendResponse } from '../../../sharedFunction/sendResponse';
import status from 'http-status';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await CategoryService.createCategory(payload);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.CREATED,
    message: 'Category Created Successfully',
    data: result,
  });
});

const getAllCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getAllCategory();
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'All Category Retrieved Successfully',
    data: result,
  });
});

const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const category_id = req.params.category_id as string;

  const result = await CategoryService.getCategoryById(category_id);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Category Retrieved Successfully',
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const category_id = req.params.category_id as string;
  const title = req.body;

  const result = await CategoryService.updateCategory(title, category_id);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Category Updated Successfully',
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const category_id = req.params.category_id as string;

  const result = await CategoryService.deleteCategory(category_id);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Category Deleted Successfully',
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
