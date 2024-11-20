import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewDiscount } from './discount.interfaces';

// Define the validation schema for creating a discount record
const createDiscountBody: Record<keyof NewDiscount, any> = {
  discount: Joi.string().required(),

};

// Validation for creating a new discount record
export const createDiscount = {
  body: Joi.object().keys(createDiscountBody),
};

// Validation for retrieving multiple discount records with query filters
export const getDiscounts = {
  query: Joi.object().keys({
    discount: Joi.string(),
    
  }),
};

// Validation for retrieving a single discount record by ID
export const getDiscount = {
  params: Joi.object().keys({
    discountId: Joi.string().custom(objectId).required(), // Changed `pricingId` to `discountId`
  }),
};

// Validation for updating a discount record by ID
export const updateDiscount = {
  params: Joi.object().keys({
    discountId: Joi.string().custom(objectId).required(), // Changed `pricingId` to `discountId`
  }),
  body: Joi.object()
    .keys({
      discount: Joi.string(),
    
    })
    .min(1), // Ensure at least one field is updated
};

// Validation for deleting a discount record by ID
export const deleteDiscount = {
  params: Joi.object().keys({
    discountId: Joi.string().custom(objectId).required(), // Changed `pricingId` to `discountId`
  }),
};
