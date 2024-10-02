import httpStatus from 'http-status';
import mongoose from 'mongoose';
import admin from 'firebase-admin';
//import serviceAccount from '../../config/serviceAccountKey.json';
import Notification from './notification.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { INotificationDoc, NewNotification, UpdateNotificationBody } from './notification.interfaces';
import User from '../user/user.model';


// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

export const createNotification = async (notificationBody: NewNotification): Promise<INotificationDoc> => {
  return Notification.create(notificationBody);
};

export const queryNotifications = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const notifications = await Notification.paginate(filter, options);
  return notifications;
};

export const getNotificationById = async (id: mongoose.Types.ObjectId): Promise<INotificationDoc | null> => 
  Notification.findById(id);

export const getNotificationsByRecipientId = async (recipientId: mongoose.Types.ObjectId): Promise<INotificationDoc[]> => {
  return Notification.find({ recipientId });
};

export const updateNotificationById = async (
  notificationId: mongoose.Types.ObjectId,
  updateBody: UpdateNotificationBody
): Promise<INotificationDoc | null> => {
  const notification = await getNotificationById(notificationId);
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }
  Object.assign(notification, updateBody);
  await notification.save();
  return notification;
};

export const deleteNotificationById = async (notificationId: mongoose.Types.ObjectId): Promise<INotificationDoc | null> => {
  const notification = await getNotificationById(notificationId);
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }
  await notification.remove();
  return notification;
};

export const createNotificationAndUpdateUser = async (userId: mongoose.Types.ObjectId, notificationData: NewNotification) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Create the notification
  const notification = await Notification.create(notificationData);

  // Optionally update the user based on the notification, e.g., setting a flag or updating a role.
  // In this example, we'll assume the user's role remains unchanged, but the notification is linked to the user.

  return { user, notification };
};

export const markNotificationAsRead = async (notificationId: string) => {
  return await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
};


// Initialize Firebase Admin SDK


// Function to send push notifications
export const sendPushNotification = async (token: string, title: string, body: string): Promise<void> => {
  const message = {
    notification: {
      title,
      body,
    },
    token,
  };

  try {
    await admin.messaging().send(message);
    console.log('Push notification sent successfully');
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw new Error('Error sending push notification');
  }
};
