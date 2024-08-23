import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewOrder, IOrderItem } from './order.interfaces';

// Define the schema for individual order items
const orderItemSchema: Joi.SchemaMap<IOrderItem> = {
  productId: Joi.string().custom(objectId).required(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().precision(2).required(),
};

// Define the schema for creating an order
const createOrderBody: Record<keyof NewOrder, any> = {
  orderId: Joi.string().required(),
  userId: Joi.string().custom(objectId).required(),
  items: Joi.array().items(Joi.object(orderItemSchema)).required(),
  amount: Joi.number().precision(2).required(),
  email: Joi.string(),
  paymentMethod: Joi.string().valid('card', 'paypal', 'bank_transfer').required(),
  paymentStatus: Joi.string().valid('pending', 'completed', 'failed').required(),
  shippingAddress: Joi.string().required(),
  billingAddress: Joi.object({
    address: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
  orderStatus: Joi.string().valid('processing', 'shipped', 'delivered', 'canceled').required(),
  deliveryDate: Joi.date().optional(),
  trackingNumber: Joi.string().optional(),
  reference: Joi.string(),
  notes: Joi.string().optional(),
};

// Validation schemas
export const createOrder = {
  body: Joi.object().keys(createOrderBody),
};

export const getOrders = {
  query: Joi.object().keys({
    orderId: Joi.string(),
    userId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

export const updateOrder = {
  params: Joi.object().keys({
    orderId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      orderId: Joi.string(),
      userId: Joi.string().custom(objectId),
      items: Joi.array().items(Joi.object(orderItemSchema)),
      amount: Joi.number().precision(2),
      paymentMethod: Joi.string().valid('card', 'paypal', 'bank_transfer'),
      paymentStatus: Joi.string().valid('pending', 'completed', 'failed'),
      shippingAddress: Joi.string(),
      billingAddress: Joi.object({
        address: Joi.string(),
        state: Joi.string(),
        country: Joi.string(),
      }),
      orderStatus: Joi.string().valid('processing', 'shipped', 'delivered', 'canceled'),
      deliveryDate: Joi.date(),
      trackingNumber: Joi.string(),
      notes: Joi.string(),
    })
    .min(1),
};

export const deleteOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

// In order.validation.ts
export const becomeSellerAndCreateOrder = {
  body: Joi.object().keys({
    orderId: Joi.string().required(),
    userId: Joi.string().custom(objectId).required(),
    items: Joi.array().items(Joi.object(orderItemSchema)).required(),
    amount: Joi.number().precision(2).required(),
    paymentMethod: Joi.string().valid('card', 'paypal', 'bank_transfer').required(),
    paymentStatus: Joi.string().valid('pending', 'completed', 'failed').required(),
    shippingAddress: Joi.string().required(),
    billingAddress: Joi.object({
      address: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
    }).required(),
    orderStatus: Joi.string().valid('processing', 'shipped', 'delivered', 'canceled').required(),
    deliveryDate: Joi.date().optional(),
    trackingNumber: Joi.string().optional(),
    notes: Joi.string().optional(),
  }),
};
