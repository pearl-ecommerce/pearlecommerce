import Joi from 'joi';
import { password, objectId } from '../validate/custom.validation';
import { NewCreatedUser } from './user.interfaces';

const createUserBody: Record<keyof NewCreatedUser, any> = {
  firstName: Joi.string().required(),
  middleName: Joi.string().allow(''),
  lastName: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().custom(password),
  phone: Joi.string(),
  dateOfBirth: Joi.date().max('now').iso(),
  imageUrl: Joi.string(),
  description: Joi.string(),
  discount: Joi.string(),
  address: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    country: Joi.string(),
    postalCode: Joi.string(),
  }),
  nin: Joi.string().length(11), // Assuming NIN is 11 digits
  businessName: Joi.string().allow(null, ''),
  socialMediaLinks: Joi.object({
    facebook: Joi.string().uri().allow(null, ''),
    twitter: Joi.string().uri().allow(null, ''),
    instagram: Joi.string().uri().allow(null, ''),
    linkedin: Joi.string().uri().allow(null, ''),
  }),
  bankAccount: Joi.object({
    accountNumber: Joi.string().length(10), // Assuming account number is 10 digits
    bankName: Joi.string(),
  }),
  role: Joi.string().valid('superadmin', 'admin','viewers', 'seller'), 
   lastseen: Joi.date(),
   active: Joi.boolean().default(true), 
 followers: Joi.string().custom(objectId),
  following: Joi.string().custom(objectId),
  userId: Joi.string().custom(objectId),


};

export const createUser = {
  body: Joi.object().keys(createUserBody),
};

export const getUsers = {
  query: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string(),
    role: Joi.string(),
    itemToSell: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
   followers: Joi.string().custom(objectId),
  following: Joi.string().custom(objectId),
  userId: Joi.string().custom(objectId),

  }),
};

export const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

export const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      firstName: Joi.string(),
      middleName: Joi.string().allow(''),
      lastName: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      dateOfBirth: Joi.date().max('now').iso(),
      phone: Joi.string(),
      imageUrl: Joi.string(),
      description: Joi.string(),
      discount: Joi.string(),
      address: Joi.object({
        street: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        country: Joi.string(),
        postalCode: Joi.string(),
        active: Joi.boolean().default(true),
        followers: Joi.string().custom(objectId),
        following: Joi.string().custom(objectId),
        

      }),
      nin: Joi.string().length(11),
      itemToSell: Joi.string().valid('electronics', 'clothing', 'food', 'furniture', 'other'),
      businessName: Joi.string().allow(null, ''),
       role: Joi.string().valid('superadmin', 'admin','viewers', 'seller'), 
      socialMediaLinks: Joi.object({
        facebook: Joi.string().uri().allow(null, ''),
        twitter: Joi.string().uri().allow(null, ''),
        instagram: Joi.string().uri().allow(null, ''),
        linkedin: Joi.string().uri().allow(null, ''),
      }),
      bankAccount: Joi.object({
        accountNumber: Joi.string().length(10),
        bankName: Joi.string(),
         
      }),
    })
    .min(1),
}; 

export const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};