import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewStore } from './store.interfaces';

const createStoreBody: Record<keyof NewStore, any> = {
  name: Joi.string().required(),
  description: Joi.string().required(),
  ownerId: Joi.string().custom(objectId).required(),
  address: Joi.string().required(),
  logoUrl: Joi.string().uri().required(),
};

export const createStore = {
  body: Joi.object().keys(createStoreBody),
};

export const getStores = {
  query: Joi.object().keys({
    name: Joi.string(),
    ownerId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getStore = {
  params: Joi.object().keys({
    storeId: Joi.string().custom(objectId),
  }),
};

export const updateStore = {
  params: Joi.object().keys({
    storeId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      address: Joi.string(),
      logoUrl: Joi.string().uri(),
    })
    .min(1),
};

export const deleteStore = {
  params: Joi.object().keys({
    storeId: Joi.string().custom(objectId),
  }),
};

// In store.validation.ts
export const becomeSellerAndCreateStore = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    address: Joi.string().required(),
    logoUrl: Joi.string().uri().required(),
  }),
};