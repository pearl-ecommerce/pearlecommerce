import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
 import pick from '../utils/pick';
 import { IOptions } from '../paginate/paginate';
import * as paymentService from './payment.service';
  
/**
 * this create the first categories
 * example CAT men women kid */ 


export const createPayment = catchAsync(async (req: Request, res: Response) => {
   // Log the request body to verify the data being sent
   console.log('Request Body:', req.body); 
 
   // Call the service layer to create a category using the data from req.body
   const payment = await paymentService.createPayments(req.body);
  const response = {
    status: true,
    message: 'User payment created successfully',
    data: payment // Include user and tokens as data
  };

   // Send back the created category data with a 201 status code
   res.status(httpStatus.CREATED).send(response);
});

/**
 * this get all category
 */
export const getPayments = catchAsync(async (req: Request, res: Response) => {
  // Extract filter and options from the request query
  const filter = pick(req.query, ['userId', 'cardNumber']); // Adjusted filter fields
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  
  // Call the service to get payments with details
  const result = await paymentService.getPaymentsWithDetails(filter, options);
  
  // Send the result back in the response
  res.send(result);
});


export const getPayment = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['productId'] === 'string') {
    const payment = await paymentService.getPaymentById(new mongoose.Types.ObjectId(req.params['productId']));
    if (!payment) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    res.send(payment);
  }
});

// /**
//  * this update category
//  */
export const updatePayment = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['paymentId'] === 'string') {
    const payment = await paymentService.updatePayments(new mongoose.Types.ObjectId(req.params['paymentId']), req.body);

      const response = {
    status: true,
    message: 'User payment updated successfully',
    data: payment 
  };

    res.send(response);
  }
});

// /**
//  * this delete category
//  */
export const deletePayment = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['paymentId'] === 'string') {
    await paymentService.deletePayments(new mongoose.Types.ObjectId(req.params['paymentId']));
    res.status(httpStatus.OK).send({ message: 'paymentId deleted successfully' });
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid payment Id');
  }
});





