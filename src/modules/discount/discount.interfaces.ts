import { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

// Core interface for Discount schema fields
export interface IDiscount {
  discount: string;
 
}

// Extending the Discount schema interface with Mongoose Document properties
export interface IDiscountDoc extends IDiscount, Document { }

// Adding static methods to the model
export interface IDiscountModel extends Model<IDiscountDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

// Define types for new discount data and updates
export type NewDiscount = IDiscount;
export type UpdateDiscountBody = Partial<IDiscount>;
