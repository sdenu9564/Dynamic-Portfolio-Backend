import { Response } from 'express';

export const sendHttpResponse = (
  res: Response,
  message: string,
  data: Record<string, any> = {},
  statusCode: number = 200,
  success: boolean = true
): Response => {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};
