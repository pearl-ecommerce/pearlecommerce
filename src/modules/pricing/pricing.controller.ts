import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as pricingService from './pricing.service';
//import path from 'path';

// Create pricing (with image upload handling if required)

export const createPricing = catchAsync(async (req: Request, res: Response) => {
   // Log the request body to verify the data being sent
  console.log('Request Body:', req.body); 
  const userId = req.body.userId;
  
   // Call the service layer to create pricing using the data from req.body
   const pricing = await pricingService.createPricing(userId, req.body);
  const response = {
    status: true,
    message: 'Pricing created successfully',
    data: pricing // Include relevant pricing data
  };

   // Send back the created pricing data with a 201 status code
   res.status(httpStatus.CREATED).send(response);
});

// Get all pricing or filter by relevant criteria

export const getPricing = catchAsync(async (req: Request, res: Response) => {
  // Pick the query parameters you want to allow for filtering
  const filter = pick(req.query, ['name', 'category', 'storeId', 'brand', 'subCategory', 'price']);
  
  // Apply case-insensitive search to certain fields (like 'name', 'category', etc.)
  if (filter.name) {
    filter.name = { $regex: new RegExp(filter.name, 'i') };  // Case-insensitive
  }
  if (filter.category) {
    filter.category = { $regex: new RegExp(filter.category, 'i') };  // Case-insensitive
  }
  if (filter.brand) {
    filter.brand = { $regex: new RegExp(filter.brand, 'i') };  // Case-insensitive
  }
  if (filter.subCategory) {
    filter.subCategory = { $regex: new RegExp(filter.subCategory, 'i') };  // Case-insensitive
  }
  // Pick options for pagination, sorting, etc.
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page']);
  
  const result = await pricingService.queryPricing(filter, options);
  
  res.status(httpStatus.OK).send(result);
});

export const getPricingById = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['pricingId'] === 'string') {
    const pricing = await pricingService.getPricingById(new mongoose.Types.ObjectId(req.params['pricingId']));
    if (!pricing) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Pricing not found');
    }
    res.send(pricing);
  }
});

export const updatePricing = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['pricingId'] === 'string') {
    const pricing = await pricingService.updatePricingById(new mongoose.Types.ObjectId(req.params['pricingId']), req.body);
    res.send(pricing);
  }
});

export const deletePricing = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['pricingId'] === 'string') {
    await pricingService.deletePricingById(new mongoose.Types.ObjectId(req.params['pricingId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});
