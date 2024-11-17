import { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

// Core interface for Pricing schema fields
export interface IPricing {
  name: string;
  description: string;
  price: number;
}

// Extending the Pricing schema interface with Mongoose Document properties
export interface IPricingDoc extends IPricing, Document { }

// Adding static methods to the model
export interface IPricingModel extends Model<IPricingDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

// Define types for new pricing data and updates
export type NewPricing = IPricing;
export type UpdatePricingBody = Partial<IPricing>;
