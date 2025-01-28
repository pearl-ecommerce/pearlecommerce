import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as roleService from './role.service';

// Create role (with image upload handling if required)
export const createRole = catchAsync(async (req: Request, res: Response) => {
  // Log the request body to verify the data being sent
  console.log('Request Body:', req.body);
 
  // Call the service layer to create role using the data from req.body
  const role = await roleService.createRole(req.body);
  const response = {
    status: true,
    message: 'Role created successfully',
    data: role, // Include relevant role data
  };

  // Send back the created role data with a 201 status code
  res.status(httpStatus.CREATED).send(response);
});

// Get all roles or filter by relevant criteria
export const getRole = catchAsync(async (req: Request, res: Response) => {
  // Pick the query parameters you want to allow for filtering
  const filter = pick(req.query, ['name']);

  // Apply case-insensitive search to certain fields (like 'name', 'category', etc.)
  if (filter.name) {
    filter.name = { $regex: new RegExp(filter.name, 'i') }; // Case-insensitive
  }

  // Pick options for pagination, sorting, etc.
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await roleService.queryRole(filter, options);

  res.status(httpStatus.OK).send(result);
});

export const getRoleById = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['roleId'] === 'string') {
    const role = await roleService.getRoleById(new mongoose.Types.ObjectId(req.params['roleId']));
    if (!role) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
    }
    res.send(role);
  }
});

export const updateRole = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['roleId'] === 'string') {
    const role = await roleService.updateRoleById(new mongoose.Types.ObjectId(req.params['roleId']), req.body);
    res.send(role);
  }
});

export const deleteRole = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['roleId'] === 'string') {
    await roleService.deleteRoleById(new mongoose.Types.ObjectId(req.params['roleId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});
