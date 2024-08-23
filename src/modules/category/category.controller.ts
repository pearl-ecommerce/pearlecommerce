import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
 import pick from '../utils/pick';
 import { IOptions } from '../paginate/paginate';
import * as categoryService from './category.service';
  
/**
 * this create the first categories
 * example CAT men women kid */ 


export const createCategories = catchAsync(async (req: Request, res: Response) => {
   // Log the request body to verify the data being sent
   console.log('Request Body:', req.body); 

   // Validate that the required fields are present in the request body
   if (!req.body.name || !req.body.description) {
     throw new ApiError(httpStatus.BAD_REQUEST, 'Name and Description are required');
   }
   // Call the service layer to create a category using the data from req.body
   const category = await categoryService.createCategories(req.body);
  const response = {
    status: true,
    message: 'Category created successfully',
    data: category// Include user and tokens as data
  };

   // Send back the created category data with a 201 status code
   res.status(httpStatus.CREATED).send(response);
});

/**
 * this get all category
 */
export const getCategories = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'category', 'storeId']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await categoryService.getCategoryWithSubcategories(filter, options);
  res.send(result);
});

// /**
//  * this update category
//  */
export const updateCategories = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['categoryId'] === 'string') {
    const category = await categoryService.updateCategories(new mongoose.Types.ObjectId(req.params['categoryId']), req.body);
const response = {
    status: true,
    message: 'Category updated successfully',
    data: category// Include user and tokens as data
  };    
    res.send(response);
  }
});

// /**
//  * this delete category
//  */
export const deleteCategories = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['categoryId'] === 'string') {
    await categoryService.deleteCategories(new mongoose.Types.ObjectId(req.params['categoryId']));
    const response = {
    status: true,
    message: 'Category deleted successfully',
  };    
    res.send(response);
    res.status(httpStatus.OK).send(response);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid category ID');
  }
});





