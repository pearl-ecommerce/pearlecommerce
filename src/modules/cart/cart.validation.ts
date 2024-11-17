import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewCart } from './cart.interfaces';

const createCartBody: Record<keyof NewCart, any> = {
  userId: Joi.string().custom(objectId).required(),
  productId: Joi.string().custom(objectId).required(),
  quantity: Joi.number().integer().min(1).required(),
  totalPrice: Joi.number().min(0).required(),
  currency: Joi.string().required(), // 
  price: Joi.number().min(0).required(),
  imageUrl: Joi.array().items(Joi.string()),
  size: Joi.string(),
  color: Joi.string(),

};

export const createCart = {
  body: Joi.object().keys(createCartBody),
};

export const getCarts = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    productId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    currency: Joi.string().required(), 
    price: Joi.number().min(0).required(),

  }),
};

export const getCart = {
  params: Joi.object().keys({
    cartId: Joi.string().custom(objectId).required(),
  }),
};

export const updateCart = {
  params: Joi.object().keys({
    cartId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      productId: Joi.string().custom(objectId),
      quantity: Joi.number().integer().min(1),
      totalPrice: Joi.number().min(0),
    })
    .min(1), // Ensures at least one field is updated
};

export const deleteCart = {
  params: Joi.object().keys({
    cartId: Joi.string().custom(objectId).required(),
  }),
};

export const removeCart = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    productId: Joi.string().custom(objectId),
  }),
};
