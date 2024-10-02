import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewNotification } from './notification.interfaces';

const createNotificationBody: Record<keyof NewNotification, any> = {
  recipientId: Joi.string().custom(objectId).required(),
  senderId: Joi.string().custom(objectId).required(),
  type: Joi.string().required(),
  message: Joi.string().required(),
  read: Joi.boolean(),
};

export const createNotification = {
  body: Joi.object().keys(createNotificationBody),
};

export const getNotifications = {
  query: Joi.object().keys({
    recipientId: Joi.string().custom(objectId),
    senderId: Joi.string().custom(objectId),
    type: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getNotification = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(objectId),
  }),
};

export const updateNotification = {
  params: Joi.object().keys({
    notificationId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      recipientId: Joi.string().custom(objectId),
      senderId: Joi.string().custom(objectId),
      type: Joi.string(),
      message: Joi.string(),
    })
    .min(1),
};

export const deleteNotification = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(objectId),
  }),
};

const sendNotificationBody = {
  token: Joi.string().required(),
  title: Joi.string().required(),
  body: Joi.string().required(),
};

export const sendNotification = {
  body: Joi.object().keys(sendNotificationBody),
};
