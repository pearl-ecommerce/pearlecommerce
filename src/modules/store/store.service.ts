import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Store from './store.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { IStoreDoc, NewStore, UpdateStoreBody } from './store.interfaces';
import User from '../user/user.model';


export const createStore = async (storeBody: NewStore): Promise<IStoreDoc> => {
  return Store.create(storeBody);
  
};

export const queryStores = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const stores = await Store.paginate(filter, options);
  return stores;
};

export const getStoreById = async (id: mongoose.Types.ObjectId): Promise<IStoreDoc | null> => Store.findById(id);


export const getStoresByOwnerId = async (ownerId: mongoose.Types.ObjectId): Promise<IStoreDoc[]> => {
  return Store.find({ ownerId }); 
};


export const updateStoreById = async (
  storeId: mongoose.Types.ObjectId,
  updateBody: UpdateStoreBody
): Promise<IStoreDoc | null> => {
  const store = await getStoreById(storeId);
  if (!store) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');
  }
  Object.assign(store, updateBody);
  await store.save();
  return store;
};

export const deleteStoreById = async (storeId: mongoose.Types.ObjectId): Promise<IStoreDoc | null> => {
  const store = await getStoreById(storeId);
  if (!store) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');
  }
  await store.remove();
  return store;
};


export const createStoreAndUpdateUser = async (userId: mongoose.Types.ObjectId, storeData: NewStore) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
 // Check if the user already has a store
  const hasStore = await getStoresByOwnerId(userId);
  console.log('hasStore:', hasStore);  // This will log the stores owned by the user

  if (hasStore.length > 0) {
    throw new ApiError(httpStatus.CONFLICT, 'User already has a store');
  }
  const store = await Store.create(storeData);
  // Update user role
  user.role = 'seller';
  await user.save();
  return { user, store };
};
