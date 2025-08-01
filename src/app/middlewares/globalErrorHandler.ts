/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import { TErrorSources } from "../interface/errorTypes";
import AppError from "../errorHelpers/AppError";
import { handleCastError, handleDuplicateError, handleMongooseValidationError, handleZodValidationError } from "../errorHelpers/globalErrorHelpers";


export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (envVars.NODE_ENV === 'development') console.log(err);

    let statusCode = 500;
    let message = 'Something went wrong!';
    let errorSources: TErrorSources[] = [];

    // Duplicate error
    if (err.code === 11000) {
        const simplifiedError = handleDuplicateError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }
    // Cast Error
    else if (err.name === 'CastError') {
        const simplifiedError = handleCastError();
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Validation Error
    else if (err.name === 'ValidationError') {
        const simplifiedError = handleMongooseValidationError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources as TErrorSources[];
    }
    // Zod validation Error
    else if (err.name === 'ZodError') {
        const simplifiedError = handleZodValidationError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources as TErrorSources[];
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    } else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err: envVars.NODE_ENV === 'development' ? err : null,
        stack: envVars.NODE_ENV === 'development' ? err.stack : null
    })
}