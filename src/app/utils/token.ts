import { Response } from 'express';
import { cookieUtils } from './cookies.js';

const setBetterAuthSessionToken = (res: Response, token: string) => {
  cookieUtils.setCookie(res, 'better-auth.session_token', token, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7 * 1000,
  });
};

export const tokenUtils = {
  setBetterAuthSessionToken,
};
