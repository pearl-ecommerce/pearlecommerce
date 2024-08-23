import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface IPayment {
  userId: mongoose.Types.ObjectId;
  cardNumber: string;
  expiryDate: string;
  cardHolderName: string;
  billingAddress: string;
}

export interface IPaymentDoc extends IPayment, Document { }

export interface IPaymentModel extends Model<IPaymentDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdatePaymentBody = Partial<IPayment>;

export type NewPayment = IPayment;
