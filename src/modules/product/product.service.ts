import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Product from './product.model';
import User from '../user/user.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { IProductDoc, NewProduct, UpdateProductBody } from './product.interfaces';


export const createProduct = async (userId: mongoose.Types.ObjectId, productData: NewProduct): Promise<IProductDoc> => {
  // Check if user exists in the database
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User really not found'); 
  }

  // CHECK IF USER HAS NIN


  // If all checks pass, create the product
  return Product.create(productData);
};

export const queryProducts = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const products = await Product.paginate(filter, options);
  return products;
};
 
export const getProductById = async (id: mongoose.Types.ObjectId): Promise<IProductDoc | null> => Product.findById(id);


export const updateProductById = async (
  productId: mongoose.Types.ObjectId,
  updateBody: UpdateProductBody
): Promise<IProductDoc | null> => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

export const deleteProductById = async (productId: mongoose.Types.ObjectId): Promise<IProductDoc | null> => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  await product.remove();
  return product;
};

export const searchProduct = async (query: string): Promise<IProductDoc[]> => {
  // Perform a case-insensitive search for the query in the product name or description
  return Product.find({
    $or: [
      { name: { $regex: query, $options: 'i' } }, // Search by name (case-insensitive)
      { description: { $regex: query, $options: 'i' } } // Search by description (case-insensitive)
    ]
  });
};
export const likeProduct = async (productId: string, userId: string) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const userIdStr = new mongoose.Types.ObjectId(userId).toString();

  // Check if the user has already liked the product
  if (!product.likes.map(id => id.toString()).includes(userIdStr)) {
    product.likes.push(new mongoose.Types.ObjectId(userId));
    await product.save();
  }

  return product;
};


export const unlikeProduct = async (productId: string, userId: string) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const userIdStr = new mongoose.Types.ObjectId(userId).toString();

  // Remove the user's like from the product
  if (product.likes.map(id => id.toString()).includes(userIdStr)) {
    product.likes = product.likes.filter(id => id.toString() !== userIdStr);
    await product.save();
  }

  return product;
};

export const getLikedProductsByUserId = async (userId: string) => {
  // Fetch products liked by the user
  const products = await Product.find({ likes: userId });
  return products;
};

export const userProducts = async (userId: mongoose.Types.ObjectId): Promise<IProductDoc[]> => {
 
  const products = await Product.find({ userId: userId }); // Replace 'likedBy' with the correct field in your schema
  return products;
};

