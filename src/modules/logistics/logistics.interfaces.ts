import  { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

// Core interface for Role schema fields
export interface IRole {
  role: string;
  name: string;
}

// Extending the Role schema interface with Mongoose Document properties
export interface IRoleDoc extends IRole, Document {}

// Adding static methods to the model
export interface IRoleModel extends Model<IRoleDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

// Define types for new role data and updates
export type NewRole = IRole;
export type UpdateRoleBody = Partial<IRole>;
