import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

// Define the structure for a single cart item

// Define the cart document interface
export interface IBundle {
userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  totalPrice: number;
  currency: string;
  imageUrl: string[];
  description: string;
  name: string;
  size: string | null;
  color: string | null;
  sellerId: mongoose.Types.ObjectId;
}

export interface IBundleDoc extends IBundle, Document {}

// Define the cart model interface
export interface IBundleModel extends Model<IBundleDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateBundleBody = Partial<IBundle>;

export type NewBundle = IBundle;
