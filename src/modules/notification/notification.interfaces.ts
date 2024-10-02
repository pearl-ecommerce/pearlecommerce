import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface INotification {
  recipientId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  type: string;
  message: string;
  read?: boolean;
}

export interface INotificationDoc extends INotification, Document {}

export interface INotificationModel extends Model<INotificationDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateNotificationBody = Partial<INotification>;

export type NewNotification = INotification;
