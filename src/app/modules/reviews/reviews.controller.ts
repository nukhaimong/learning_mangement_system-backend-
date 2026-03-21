import { Request, Response } from 'express';
import { catchAsync } from '../../../sharedFunction/catchAsync';
import { ReviewsService } from './reviews.service';
import { sendResponse } from '../../../sharedFunction/sendResponse';
import status from 'http-status';

const createReviews = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await ReviewsService.createReviews(payload);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.CREATED,
    message: 'Reviews created successfully',
    data: result,
  });
});

const updateReviews = catchAsync(async (req: Request, res: Response) => {
  const { content, reviews_id, learner_id } = req.body;
  const result = await ReviewsService.updateReviews(
    content,
    reviews_id,
    learner_id,
  );
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Reviews updated successfully',
    data: result,
  });
});

const deleteReviews = catchAsync(async (req: Request, res: Response) => {
  const { reviews_id, learner_id } = req.body;
  const result = await ReviewsService.deleteReviews(reviews_id, learner_id);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Reviews deleted successfully',
    data: result,
  });
});

export const ReviewsController = {
  createReviews,
  updateReviews,
  deleteReviews,
};
