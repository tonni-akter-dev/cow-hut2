/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import httpStatus from 'http-status';
import { ErrorRequestHandler } from 'express';
import ApiError from '../../errors/ApiError';
import { IGenericErrorMessage } from '../../interface/error';
import { config } from '../../config';
import { ZodError } from 'zod';
import handleZodValidationError from '../../errors/handleZodValidationError';
import handleMongooseValidationError from '../../errors/handleMongooseValidationError';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Something went wrong';
  let errorMessages: IGenericErrorMessage[] = [];

  // mongoose validation error
  if (error?.name === 'ValidationError') {
    const simplifiedError = handleMongooseValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  }

  // zod validation error
  else if (error instanceof ZodError) {
    const simplifiedError = handleZodValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  }
  // Error class this is default express error class
  else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [{ message: error.message, path: '' }]
      : [];
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error?.message;
    errorMessages = error?.message
      ? [{ message: error.message, path: '' }]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env === 'development' ? error.stack : undefined,
  });
};

export default globalErrorHandler;
