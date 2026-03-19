import { CookieOptions, Request, Response } from 'express';

const setCookie = (
  res: Response,
  key: string,
  value: string,
  options: CookieOptions,
) => {
  res.cookie(key, value, options);
};

const getCookie = (req: Request, key: string) => {
  return req.cookies[key];
};

export const cookieUtils = {
  setCookie,
  getCookie,
};
