import { Request, Response } from 'express';
import { catchAsync } from '../../../sharedFunction/catchAsync';
import { LearnerService } from './learner.service';
import { sendResponse } from '../../../sharedFunction/sendResponse';
import status from 'http-status';

const getLearners = catchAsync(async (req: Request, res: Response) => {
  const result = await LearnerService.getLearners();
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Learners retrieved successfully',
    data: result,
  });
});

const getLearnerById = catchAsync(async (req: Request, res: Response) => {
  const learner_id = req.params.learner_id as string;
  const result = await LearnerService.getLearnerById(learner_id);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Learner retrieved successfully',
    data: result,
  });
});

const updateLearner = catchAsync(async (req: Request, res: Response) => {
  const learner_id = req.params.learner_id as string;
  const user = req.user;

  const payload = {
    ...req.body,
    ...(req.file?.path && { profile_photo: req.file.path }),
  };

  const result = await LearnerService.updateLearner(user, learner_id, payload);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Learner updated successfully',
    data: result,
  });
});

const deleteLearner = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const learner_id = req.params.learner_id as string;

  const result = await LearnerService.deleteLearner(user, learner_id);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Learner deleted successfully',
    data: result,
  });
});

export const LearnerController = {
  getLearners,
  getLearnerById,
  updateLearner,
  deleteLearner,
};
