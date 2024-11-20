import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewProduct } from './product.interfaces';

const createProductBody: Record<keyof NewProduct, any> = {
  name: Joi.string().required(), 
  description: Joi.string().required(),
  price: Joi.number().required().min(0),
  category: Joi.string().required(),
  storeId: Joi.string().custom(objectId),
  imageUrl: Joi.array().items(Joi.string().uri()).required(),
  stock: Joi.number().integer().min(0).required(),
  brand: Joi.string().required(),
  subCategory: Joi.string(),
  subsubcategory: Joi.string(),
  likes: Joi.string(),
  userId: Joi.string().custom(objectId),
  condition: Joi.string().required(),
  size: Joi.string().required(),
  color: Joi.string().required(),


};

export const createProduct = {
  body: Joi.object().keys(createProductBody),
};

export const getProducts = {
  query: Joi.object().keys({
    name: Joi.string(),
    category: Joi.string(),
    subCategory: Joi.string(),
    subsubcategory: Joi.string(),
    storeId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    brand: Joi.string(),
    likes: Joi.string(),
    condition: Joi.string(),
    size: Joi.string(),
    color: Joi.string(),
    userId: Joi.string().custom(objectId),



  }),
};

export const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

export const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      price: Joi.number().min(0),
      category: Joi.string(),
      subCategory: Joi.string(),
      subsubcategory: Joi.string(),
      imageUrl: Joi.array().items(Joi.string().uri()),
      stock: Joi.number().integer().min(0),
      brand: Joi.string(),
      likes: Joi.string(),
      condition: Joi.string(),
      size: Joi.string(),
      color: Joi.string(),
    })
    .min(1),
};

export const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

export const searchProduct = {
  params: Joi.object().keys({
    search: Joi.string().custom(objectId),
  }),
};