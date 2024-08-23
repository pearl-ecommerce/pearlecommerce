import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewCategory } from './category.interfaces';

const createCategories: Record<keyof NewCategory, any> = {
    name: Joi.string(),
  description: Joi.string(),
  subCategories: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      subSubCategories: Joi.array().items(
        Joi.object({
          name: Joi.string(),
        })
      ).optional(),
    })
  ).optional(),
};




export const createCategory = {
  body: Joi.object().keys(createCategories),
};

export const getCategory = {
  query: Joi.object().keys({
    name: Joi.string(),
   
  }),
};


export const updateCategory = {
  params: Joi.object().keys({
    CategoryId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
  description: Joi.string(),
  subCategories: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      subSubCategories: Joi.array().items(
        Joi.object({
          name: Joi.string(),
        })
      ).optional(),
    })
  ).optional(),
   
    })
    .min(1),
};

export const deleteCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
};

