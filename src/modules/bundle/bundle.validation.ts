import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewBundle } from './bundle.interfaces';

const createBundleBody: Record<keyof NewBundle, any> = {
  userId: Joi.string().custom(objectId),
  productId: Joi.string().custom(objectId).required(),
  quantity: Joi.number().integer().min(1),
  totalPrice: Joi.number().min(0),
  currency: Joi.string(),
  category:Joi.string(),
  price: Joi.number().min(0),
  imageUrl: Joi.array().items(Joi.string()),
   description: Joi.string(),
  name: Joi.string(),
  size: Joi.string(),
  color: Joi.string(),
  sellerId: Joi.string(),

};

export const createBundle = {
  body: Joi.object().keys(createBundleBody),
};

export const getBundles = {
  query: Joi.object().keys({
    bundleId: Joi.string().custom(objectId),
    productId: Joi.string().custom(objectId),
    userId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    currency: Joi.string(), 
    price: Joi.number().min(0),
      sellerId: Joi.string(),

  }),
};

export const getBundle = {
  params: Joi.object().keys({
    bundleId: Joi.string().custom(objectId).required(),
  }),
};

export const updateBundle = {
  params: Joi.object().keys({
    bundleId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      productId: Joi.string().custom(objectId),
      quantity: Joi.number().integer().min(1),
      totalPrice: Joi.number().min(0),
    })
    .min(1), // Ensures at least one field is updated
};

export const deleteBundle = {
  params: Joi.object().keys({
    bundleId: Joi.string().custom(objectId).required(),
  }),
};

export const removeBundle = {
  query: Joi.object().keys({
    bundleId: Joi.string().custom(objectId),
    productId: Joi.string().custom(objectId),
  }),
};
