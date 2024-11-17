import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewPricing } from './pricing.interfaces';

// Define the validation schema for creating a pricing record
const createPricingBody: Record<keyof NewPricing, any> = {
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required().min(0),
};

// Validation for creating a new pricing record
export const createPricing = {
  body: Joi.object().keys(createPricingBody),
};

// Validation for retrieving multiple pricing records with query filters
export const getPricings = {
  query: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    price: Joi.number().min(0), 
  }),
};

// Validation for retrieving a single pricing record by ID
export const getPricing = {
  params: Joi.object().keys({
    pricingId: Joi.string().custom(objectId).required(),
  }),
};

// Validation for updating a pricing record by ID
export const updatePricing = {
  params: Joi.object().keys({
    pricingId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      price: Joi.number().min(0),
    })
    .min(1), // Ensure at least one field is updated
};

// Validation for deleting a pricing record by ID
export const deletePricing = {
  params: Joi.object().keys({
    pricingId: Joi.string().custom(objectId).required(),
  }),
};
