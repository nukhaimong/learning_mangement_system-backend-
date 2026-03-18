import { Request, Response } from 'express';
import { catchAsync } from '../../../sharedFunction/catchAsync';
import { AuthService } from './auth.service';
import { sendResponse } from '../../../sharedFunction/sendResponse';
import status from 'http-status';

const registration = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AuthService.registration(payload);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.CREATED,
    message: "You've registered successfully",
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AuthService.login(payload);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'User login successfully',
    data: result,
  });
});

export const AuthController = {
  registration,
  login,
};
