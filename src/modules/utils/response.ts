import { Response } from 'express';

/**
 * Send a success response
 * @param res - Express response object
 * @param statusCode - HTTP status code (default: 200)
 * @param data - Data to send in the response body
 */
export const sendSuccessResponse = (res: Response, statusCode = 200, message?: string, data?: any,): void => {
    res.status(statusCode).json({
        success: true,
        message: message || '',
        data: data || {},
    });
};

/**
 * Send an error response
 * @param res - Express response object
 * @param statusCode - HTTP status code (default: 500)
 * @param message - Error message to send in the response body
 */
export const sendErrorResponse = (res: Response, statusCode = 500, message?: string): void => {
    res.status(statusCode).json({
        success: false,
        error: message || 'Internal Server Error',
    });
};