import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Pricing from './pricing.model';
import User from '../user/user.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { IPricingDoc, NewPricing, UpdatePricingBody } from './pricing.interfaces';

export const createPricing = async (userId: mongoose.Types.ObjectId, pricingData: NewPricing): Promise<IPricingDoc> => {
  // Check if user exists in the database
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // If all checks pass, create the pricing
  return Pricing.create(pricingData);
};

export const queryPricing = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const pricing = await Pricing.paginate(filter, options);
  return pricing;
};

export const getPricingById = async (id: mongoose.Types.ObjectId): Promise<IPricingDoc | null> => Pricing.findById(id);

export const updatePricingById = async (
  pricingId: mongoose.Types.ObjectId,
  updateBody: UpdatePricingBody
): Promise<IPricingDoc | null> => {
  const pricing = await getPricingById(pricingId);
  if (!pricing) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pricing not found');
  }
  Object.assign(pricing, updateBody);
  await pricing.save();
  return pricing;
};

export const deletePricingById = async (pricingId: mongoose.Types.ObjectId): Promise<IPricingDoc | null> => {
  const pricing = await getPricingById(pricingId);
  if (!pricing) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pricing not found');
  }
  await pricing.remove();
  return pricing;
};
