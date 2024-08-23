import { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

// Sub-Sub-Category Interface
export interface ISubSubCategory {
  name: string;
}
 
// Sub-Category Interface
export interface ISubCategory {
  name: string;
  subSubCategories?: ISubSubCategory[];
}

// Main Category Interface
export interface ICategory {
  name: string;
  description: string;
  subCategories?: ISubCategory[];
}

// Category Document Interface
export interface ICategoryDoc extends ICategory, Document {}

// Category Model Interface
export interface ICategoryModel extends Model<ICategoryDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

// Update Category Body
export type UpdateCategoryBody = Partial<ICategory>;

// New Category Type
export type NewCategory = ICategory;
