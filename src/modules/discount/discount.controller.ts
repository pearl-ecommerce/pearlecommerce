import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as discountService from './discount.service';

// Create discount (with image upload handling if required)

export const createDiscount = catchAsync(async (req: Request, res: Response) => {
  // Log the request body to verify the data being sent
  console.log('Request Body:', req.body);
  const userId = req.body.userId;

  // Call the service layer to create discount using the data from req.body
  const discount = await discountService.createDiscount(userId, req.body);
  const response = {
    status: true,
    message: 'Discount created successfully',
    data: discount, // Include relevant discount data
  };

  // Send back the created discount data with a 201 status code
  res.status(httpStatus.CREATED).send(response);
});

// Get all discounts or filter by relevant criteria

export const getDiscount = catchAsync(async (req: Request, res: Response) => {
  // Pick the query parameters you want to allow for filtering
  const filter = pick(req.query, ['name']);

  // Apply case-insensitive search to certain fields (like 'name', 'category', etc.)
  if (filter.name) {
    filter.name = { $regex: new RegExp(filter.name, 'i') }; // Case-insensitive
  }

  // Pick options for pagination, sorting, etc.
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await discountService.queryDiscount(filter, options);

  res.status(httpStatus.OK).send(result);
});

export const getDiscountById = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['discountId'] === 'string') {
    const discount = await discountService.getDiscountById(new mongoose.Types.ObjectId(req.params['discountId']));
    if (!discount) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Discount not found');
    }
    res.send(discount);
  }
});

export const updateDiscount = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['discountId'] === 'string') {
    const discount = await discountService.updateDiscountById(new mongoose.Types.ObjectId(req.params['discountId']), req.body);
    res.send(discount);
  }
});

export const deleteDiscount = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['discountId'] === 'string') {
    await discountService.deleteDiscountById(new mongoose.Types.ObjectId(req.params['discountId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});
