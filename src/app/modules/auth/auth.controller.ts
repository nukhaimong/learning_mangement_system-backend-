import { Request, Response } from 'express';
import { catchAsync } from '../../../sharedFunction/catchAsync';
import { AuthService } from './auth.service';
import { sendResponse } from '../../../sharedFunction/sendResponse';
import status from 'http-status';
import { envVars } from '../../../config/env';
import { auth } from '../../lib/auth';
import AppError from '../../errorHelpers/appError';
import { tokenUtils } from '../../utils/token';
import { User } from '../../../generated/prisma/client';

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

  tokenUtils.setBetterAuthSessionToken(res, result.token);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'User login successfully',
    data: result,
  });
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success`;
  res.render('googleLogin', {
    callbackURL,
    betterAuthUrl: envVars.BETTER_AUTH_URL,
  });
});

const googleLoginSuccess = catchAsync(async (req: Request, res: Response) => {
  const sessionToken = req.cookies['better-auth.session_token'];

  if (!sessionToken) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
  }
  const session = await auth.api.getSession({
    headers: {
      Cookie: `better-auth.session_token=${sessionToken}`,
    },
  });

  if (!session) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_session`);
  }
  if (session && !session.user) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=user_not_found`);
  }

  const profilExist = await AuthService.isProfileExist(session.user as User);

  if (!profilExist) {
    res.redirect(`${envVars.FRONTEND_URL}/upgrade-role`);
  } else {
    res.redirect(`${envVars.FRONTEND_URL}`);
  }
});

const updateRole = catchAsync(async (req: Request, res: Response) => {
  const { role } = req.body;

  const sessionToken = req.cookies['better-auth.session_token'];

  if (!sessionToken) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
  }

  const session = await auth.api.getSession({
    headers: {
      Cookie: `better-auth.session_token=${sessionToken}`,
    },
  });

  if (!session) {
    throw new AppError(status.NOT_FOUND, 'Session not found');
  }
  const result = await AuthService.updateRole(role, session.user as User);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'User Role Registered Successfully',
    data: result,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const result = await AuthService.verifyEmail(email, otp);

  tokenUtils.setBetterAuthSessionToken(res, result.token as string);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Email Verified Successfully',
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  await AuthService.forgotPassword(email);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Password reset otp send to email successfully',
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  await AuthService.resetPassword(email, otp, newPassword);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'Password reset successfully',
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await AuthService.getMe(user);
  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: 'User get successfully',
    data: result,
  });
});

export const AuthController = {
  registration,
  login,
  googleLogin,
  googleLoginSuccess,
  updateRole,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
};
