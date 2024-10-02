import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as notificationService from './notification.service';

export const sendNotification = catchAsync(async (req: Request, res: Response) => {
  const { token, title, body } = req.body; 

  // Validate request body
  if (!token || !title || !body) {
    return res.status(400).send({ message: 'Token, title, and body are required' });
  }

  // Send push notification using service
  await notificationService.sendPushNotification(token, title, body);

  const response = {
    status: true,
    message: 'Push notification sent successfully',
  };

   return res.status(200).send(response);
});

export const createNotification = catchAsync(async (req: Request, res: Response) => {
  const notification = await notificationService.createNotification(req.body);
  const response = {
    status: true,
    message: 'Notification created successfully',
    data: notification, // Include notification data
  };
  res.status(httpStatus.CREATED).send(response);
});

export const getNotifications = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['recipientId', 'senderId', 'type']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await notificationService.queryNotifications(filter, options);
  res.send(result);
});

export const getNotification = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['notificationId'] === 'string') {
    const notification = await notificationService.getNotificationById(new mongoose.Types.ObjectId(req.params['notificationId']));
    if (!notification) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
    }
    res.send(notification);
  }
});

export const updateNotification = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['notificationId'] === 'string') {
    const notification = await notificationService.updateNotificationById(new mongoose.Types.ObjectId(req.params['notificationId']), req.body);
    const response = {
      status: true,
      message: 'Notification updated successfully',
      data: notification, // Include notification data
    };

    res.send(response);
  }
});

export const deleteNotification = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['notificationId'] === 'string') {
    await notificationService.deleteNotificationById(new mongoose.Types.ObjectId(req.params['notificationId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});

export const markNotificationAsRead = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['notificationId'] === 'string') {
    const notification = await notificationService.markNotificationAsRead(
      req.params['notificationId']
    );
    if (!notification) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
    }
    const response = {
      status: true,
      message: 'Notification updated successfully',
      data: notification, // Include notification data
    };
    res.send(response);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid notification ID');
  }
});

 