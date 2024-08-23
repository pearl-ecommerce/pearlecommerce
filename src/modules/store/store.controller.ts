import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as storeService from './store.service';

export const createStore = catchAsync(async (req: Request, res: Response) => {
  const store = await storeService.createStore(req.body);
  const response = {
    status: true,
    message: 'User store created successfully',
    data: store // Include user and tokens as data
  };
  res.status(httpStatus.CREATED).send(response);
});

export const getStores = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'ownerId']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await storeService.queryStores(filter, options);
  res.send(result);
});

export const getStore = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['storeId'] === 'string') {
    const store = await storeService.getStoreById(new mongoose.Types.ObjectId(req.params['storeId']));
    if (!store) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');
    }
    res.send(store);
  }
});

export const updateStore = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['storeId'] === 'string') {
    const store = await storeService.updateStoreById(new mongoose.Types.ObjectId(req.params['storeId']), req.body);
      const response = {
    status: true,
    message: 'store updated successfully',
    data: store // Include user and tokens as data
  };

    res.send(response);
  }
});

export const deleteStore = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['storeId'] === 'string') {
    await storeService.deleteStoreById(new mongoose.Types.ObjectId(req.params['storeId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});

// In store.controller.ts
export const becomeSellerAndCreateStore = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id; // Assuming you have authentication middleware
  const storeData = req.body;

  const { user, store } = await storeService.createStoreAndUpdateUser(userId, storeData);

  res.status(httpStatus.CREATED).send({ user, store });
});