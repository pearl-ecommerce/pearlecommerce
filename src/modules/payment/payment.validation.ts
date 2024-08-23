import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewPayment } from './payment.interfaces';

const createPayments: Record<keyof NewPayment, any> = {
  userId: Joi.string().custom(objectId).required(),
  cardNumber: Joi.string().creditCard().required(),
  expiryDate: Joi.string().required(),
  cardHolderName: Joi.string().required(),
  billingAddress: Joi.string().required(),
};

export const createPayment = {
  body: Joi.object().keys(createPayments),
};

export const getPayment = {
  query: Joi.object().keys({
    paymentId: Joi.string().custom(objectId),
  }),
};

export const getPayments = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  cardNumber: Joi.string().creditCard().required(),
  expiryDate: Joi.string().required(),
  cardHolderName: Joi.string().required(),
  billingAddress: Joi.string().required(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};



export const updatePayment = {
  params: Joi.object().keys({
    paymentId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      cardNumber: Joi.string().creditCard(),
      expiryDate: Joi.string(),
      cardHolderName: Joi.string(),
      billingAddress: Joi.string(),
    })
    .min(1),
};

export const deletePayment = {
  params: Joi.object().keys({
    paymentId: Joi.string().custom(objectId).required(),
  }),
};
