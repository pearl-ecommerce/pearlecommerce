import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

// Define the structure for a single cart item

// Define the cart document interface
export interface ICart {
userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  totalPrice: number;
  currency: string;
  imageUrl: string[];
  size: string | null;
  color: string | null;
}

export interface ICartDoc extends ICart, Document {}

// Define the cart model interface
export interface ICartModel extends Model<ICartDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateCartBody = Partial<ICart>;

export type NewCart = ICart;
