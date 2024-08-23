import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Category from './category.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { ICategoryDoc, NewCategory, UpdateCategoryBody } from './category.interfaces';
//import { getCategory } from './category.validation';

export const createCategories = async (categoryBody: NewCategory | null): Promise<ICategoryDoc> => {
  
  return Category.create(categoryBody);
};

export const getCategoryId = async (id: mongoose.Types.ObjectId): Promise<ICategoryDoc | null> => Category.findById(id);

export const getCategoryWithSubcategories = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const Categories = await Category.paginate(filter, options);
  // const subCategories = await Category.find({ parent: Category._id });
   return Categories;
   
};

export const updateCategories = async (
  CategoryId: mongoose.Types.ObjectId,
  updateBody: UpdateCategoryBody
): Promise<ICategoryDoc | null> => {
  const Categories = await getCategoryId(CategoryId);
  if (!Categories) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  Object.assign(Categories, updateBody);
  await Categories.save();
  return Categories;
};

export const deleteCategories = async (CategoryId: mongoose.Types.ObjectId): Promise<ICategoryDoc | null> => {
  const Categories = await getCategoryId(CategoryId);
  if (!Categories) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  await Categories.remove();
  return Categories;
};



