import { NextFunction, Request, Response } from 'express';
import { Role, UserStatus } from '../../generated/prisma/enums';
import { cookieUtils } from '../utils/cookies';
import AppError from '../errorHelpers/appError';
import status from 'http-status';
import { prisma } from '../lib/prisma';

export const checkAuth = (...authRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = await cookieUtils.getCookie(
        req,
        'better-auth.session_token',
      );
      if (!sessionToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          'Unauthorize access. No token is provided',
        );
      }
      const isSessionExist = await prisma.session.findFirst({
        where: {
          token: sessionToken,
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          user: true,
        },
      });
      if (!isSessionExist) {
        throw new AppError(
          status.UNAUTHORIZED,
          'Opps, seems user is looged out, please login again',
        );
      }

      if (isSessionExist && isSessionExist.user) {
        const user = isSessionExist.user;

        if (user.isDeleted) {
          throw new AppError(
            status.UNAUTHORIZED,
            'Opps! this user is deleted, please create a new account',
          );
        }
        if (
          user.status === UserStatus.BLOCKED ||
          user.status === UserStatus.DELETED
        ) {
          throw new AppError(
            status.UNAUTHORIZED,
            'Unauthorize access. User is not active or deleted',
          );
        }

        if (authRoles.length > 0 && !authRoles.includes(user.role as Role)) {
          throw new AppError(
            status.FORBIDDEN,
            "Forbidden access. you don't have permissin to access this resource.",
          );
        }
        req.user = {
          user_id: user.id,
          role: user.role as Role,
          email: user.email,
        };
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
