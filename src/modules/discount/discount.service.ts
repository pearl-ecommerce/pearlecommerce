import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Discount from './discount.model';
import User from '../user/user.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { IDiscountDoc, NewDiscount, UpdateDiscountBody } from './discount.interfaces';

export const createDiscount = async (userId: mongoose.Types.ObjectId, discountData: NewDiscount): Promise<IDiscountDoc> => {
  // Check if user exists in the database
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // If all checks pass, create the discount
  return Discount.create(discountData);
};

export const queryDiscount = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const discount = await Discount.paginate(filter, options);
  return discount;
};

export const getDiscountById = async (id: mongoose.Types.ObjectId): Promise<IDiscountDoc | null> => Discount.findById(id);

export const updateDiscountById = async (
  discountId: mongoose.Types.ObjectId,
  updateBody: UpdateDiscountBody
): Promise<IDiscountDoc | null> => {
  const discount = await getDiscountById(discountId);
  if (!discount) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Discount not found');
  }
  Object.assign(discount, updateBody);
  await discount.save();
  return discount;
};

export const deleteDiscountById = async (discountId: mongoose.Types.ObjectId): Promise<IDiscountDoc | null> => {
  const discount = await getDiscountById(discountId);
  if (!discount) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Discount not found');
  }
  await discount.remove();
  return discount;
};
