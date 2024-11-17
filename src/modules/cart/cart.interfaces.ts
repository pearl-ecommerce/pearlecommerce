import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

// Define the structure for a single cart item

// Define the cart document interface
export interface ICart {
   productId: mongoose.Types.ObjectId; // Reference to the product 
  price: number; 
  quantity: number; 
  imageUrl: string[]; 
  size?: string; 
  color?: string; 
  userId: mongoose.Types.ObjectId; 
  totalPrice: number; 
  currency: string; 
}

export interface ICartDoc extends ICart, Document {}

// Define the cart model interface
export interface ICartModel extends Model<ICartDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateCartBody = Partial<ICart>;

export type NewCart = ICart;
