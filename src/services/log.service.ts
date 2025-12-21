import { Request, Response, NextFunction } from 'express';
import PrettyError from 'pretty-error';
import HTTPStatus from 'http-status';
import APIError, { RequiredError } from './error.service';
import constants from '../config/constants';

const isDev = constants.NODE_ENV === 'development';

interface ValidationErrorDetail {
  field: string;
  messages: string[];
}

interface ExpressError extends Error {
  status?: number;
  details?: Record<string, any> | ValidationErrorDetail[];
  errors?: Record<string, any> | ValidationErrorDetail[];
  isPublic?: boolean;
}

/**
 * Centralized Error Logging & Response Middleware
 * Logs errors in dev mode and returns clean error responses.
 */
export default function logErrorService(
  err: ExpressError,
  req: Request,
  res: Response,
  _next: NextFunction
): Response {
  if (!err) {
    const fallbackError = new APIError(
      'Error with the server!',
      HTTPStatus.INTERNAL_SERVER_ERROR,
      true
    );
    return res
      .status(fallbackError.status)
      .json({ message: fallbackError.message });
  }

  if (isDev) {
    const pe = new PrettyError();
    pe.skipNodeFiles();
    pe.skipPackage('express');
    console.error(pe.render(err));
  }

  const errorResponse: Record<string, any> = {
    message: err.message || 'Internal Server Error.',
  };

  if (err.details) {
    const { details } = err;
    errorResponse.errors = {};

    if (Array.isArray(details)) {
      errorResponse.errors = RequiredError.makeValidationsPretty(details as any[]);
    } else {
      for (const key of Object.keys(details)) {
        errorResponse.errors[key] = details[key];
      }
    }
  }

  return res
    .status(err.status || HTTPStatus.INTERNAL_SERVER_ERROR)
    .json(errorResponse);
}
