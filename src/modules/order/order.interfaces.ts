import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder {
  orderId: string;
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  amount: number;
  email: string;
  paymentMethod: 'card' | 'paypal' | 'bank_transfer';
  paymentStatus: 'pending' | 'completed' | 'failed';
  shippingAddress: string;
  reference: string;
  billingAddress: {
    address: string;
    state: string;
    country: string;
  };
  orderStatus: 'processing' | 'shipped' | 'delivered' | 'canceled';
  deliveryDate?: Date;
  trackingNumber?: string;
  notes?: string;
}

export interface IOrderDoc extends IOrder, Document {}

export interface IOrderModel extends Model<IOrderDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateOrderBody = Partial<IOrder>;

export type NewOrder = IOrder;

