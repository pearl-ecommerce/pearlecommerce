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
  console.log('Request body:', req.body);  // Log the form-data fields
  console.log('Uploaded file:', req.file);  // Log the uploaded file (imageUrl)

  const userId = req.body.userId;  // Extract userId from the body

  // Check if a file is uploaded with the field name 'imageUrl'
  const imagePath = req.file ? req.file.path : null;

  // Prepare the product data by combining form-data and file path
  const productData = {
    ...req.body,
    imageUrl: imagePath  // Attach the uploaded file path to product data
  };

  // Call the service to save the product
  const product = await productService.createProduct(userId, productData);

  // Respond with the created product
  res.status(httpStatus.CREATED).json(product);
});

// Get all products or filter by name, category, brand, etc.
export const getProducts = catchAsync(async (req: Request, res: Response) => {
  // Pick the query parameters you want to allow for filtering
  const filter = pick(req.query, ['name', 'category', 'storeId', 'brand', 'subCategory', 'size', 'subsubcategory', 'price']);
  // Pick options for pagination, sorting, etc.
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productService.queryProducts(filter, options);
  res.status(httpStatus.OK).send(result);
});


// export const getProducts = catchAsync(async (req: Request, res: Response) => {
//   const filter = pick(req.query, ['name', 'category', 'storeId']);
//   const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
//   const result = await productService.queryProducts(filter, options);
//   res.send(result);
// });

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
    res.status(httpStatus.NO_CONTENT).send();
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