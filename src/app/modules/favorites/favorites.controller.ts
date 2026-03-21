import { Request, Response } from 'express';
import { catchAsync } from '../../../sharedFunction/catchAsync';
import { FavoritesService } from './favorites.service';
import { sendResponse } from '../../../sharedFunction/sendResponse';
import status from 'http-status';

const addToFavorites = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await FavoritesService.addToFavorites(payload);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.CREATED,
    message: 'Course added to tavourites successfully',
    data: result,
  });
});

const deleteFavorites = catchAsync(async (req: Request, res: Response) => {
  const { course_id, learner_id } = req.body;
  const result = await FavoritesService.deleteFavorites(course_id, learner_id);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Course deleted from favorites successfully',
    data: result,
  });
});

export const FavoritesController = {
  addToFavorites,
  deleteFavorites,
};
