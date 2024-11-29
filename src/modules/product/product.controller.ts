import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as productService from './product.service';
//import path from 'path';

// Create product with image upload handling (with field name 'imageUrl' for file)

export const createProduct = catchAsync(async (req: Request, res: Response) => {
   // Log the request body to verify the data being sent
  console.log('Request Body:', req.body); 
  const userId = req.body.userId;
  
   // Call the service layer to create a category using the data from req.body
   const product = await productService.createProduct(userId, req.body);
  const response = {
    status: true,
    message: 'product created successfully',
    data: product// Include user and tokens as data
  };

   // Send back the created category data with a 201 status code
   res.status(httpStatus.CREATED).send(response);
});

// Get all products or filter by name, category, brand, etc.

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  // Pick the query parameters you want to allow for filtering
  const filter = pick(req.query, ['name', 'category', 'storeId', 'brand', 'subCategory', 'size', 'c', 'price']);
  
  // Apply case-insensitive search to certain fields (like 'name', 'category', etc.)
  if (filter.name) {
    filter.name = { $regex: new RegExp(filter.name, 'i') };  // Case-insensitive
  }
  if (filter.category) {
    filter.category = { $regex: new RegExp(filter.category, 'i') };  // Case-insensitive
  }
  if (filter.brand) {
    filter.brand = { $regex: new RegExp(filter.brand, 'i') };  // Case-insensitive
  }
   if (filter.subsubcategory) {
    filter.subsubcategory = { $regex: new RegExp(filter.subsubcategory, 'i') };  // Case-insensitive
  }
   if (filter.subCategory) {
    filter.subCategory = { $regex: new RegExp(filter.subCategory, 'i') };  // Case-insensitive
  }
  // Pick options for pagination, sorting, etc.
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page']);
  
  const result = await productService.queryProducts(filter, options);
  
  res.status(httpStatus.OK).send(result);
});

export const getProduct = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['productId'] === 'string') {
    const product = await productService.getProductById(new mongoose.Types.ObjectId(req.params['productId']));
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    res.send(product);
  }
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['productId'] === 'string') {
    const product = await productService.updateProductById(new mongoose.Types.ObjectId(req.params['productId']), req.body);
    res.send(product);
  }
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['productId'] === 'string') {
    await productService.deleteProductById(new mongoose.Types.ObjectId(req.params['productId']));
    res.status(httpStatus.OK).send({ message: 'Product deleted successfully' });  
  }
});

export const searchProduct = catchAsync(async (req: Request, res: Response) => {
  
  const query = req.body.search; // Get the search query from URL params
console.log('Search Query:', query); // Log the query to the console

  if (typeof query == 'string') {
    
    // Call searchProduct with the query string
    const products = await productService.searchProduct(query);

    // Return the list of products found
    res.send(products);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Search Query');
  }
});

// export const getTotalLikes = catchAsync(async (req: Request, res: Response) => {
//   const { productId } = req.params;

//   const product = await Product.findById(productId);
//   if (!product) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
//   }

//   res.status(200).send({ totalLikes: product.likes.length });
// });

//Like a product
export const likeProduct = catchAsync(async (req: Request, res: Response) => {
 const { userId, productId } = req.body;

  if (typeof productId === 'string') {
    const product = await productService.likeProduct(productId, userId);
    res.status(200).send({ message: 'Product liked', product });
  } else {
    res.status(400).send({ message: 'Invalid product ID' });
  }
});

// Unlike a product
export const unlikeProduct = catchAsync(async (req: Request, res: Response) => {
  const { userId, productId } = req.body;

  if (typeof productId === 'string') {
    const product = await productService.unlikeProduct(productId, userId);
    res.status(200).send({ message: 'Product unliked', product });
  } else {
    res.status(400).send({ message: 'Invalid product ID' });
  }
});

// Get liked products
export const getLikedProducts = catchAsync(async (req: Request, res: Response) => {
//  const userId = req.user.id;
const userId = req.body;
  if (typeof userId === 'string') {
    const products = await productService.getLikedProductsByUserId(userId);
    res.status(200).send({ likedProducts: products });
  } else {
    res.status(400).send({ message: 'Invalid user ID' });
  }
});

export const userProducts = catchAsync(async (req: Request, res: Response) => {
  // Check if `userId` is provided as a string in the request parameters
  // const userId = req.body;
  const userId = req.query['userId'] as string;
  if (typeof userId == 'string') {
    console.log("User ID received:", req.params['userId']);

    // Call the service function to fetch products created by the user
    const products = await productService.userProducts(new mongoose.Types.ObjectId(userId));

    // If no products are found, throw a 404 error
    if (!products || products.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No products found for the specified user');
    }

    // Send the list of products as a response
    res.status(httpStatus.OK).send(products);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or missing user ID');
  }
});



