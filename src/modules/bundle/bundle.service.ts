import mongoose from 'mongoose';
import Bundle from './bundle.model';
import User from '../user/user.model';
import Product from '../product/product.model';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';
import { IBundleDoc } from './bundle.interfaces';

export const addItem = async (userId: string, productId: string, quantity: number): Promise<IBundleDoc> => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  // Step 2: Calculate the total price
  const price = product.price;
  const imageUrl = product.imageUrl[0]; 
  const totalPrice = price * quantity;
  const sellerId = product.userId;
  const description = product.description;
  const name = product.name;
  const category = product.category;
  const subCategory = product.subCategory;
  const subsubcategory = product.subsubcategory;
  

  const existingBundle = await Bundle.findOne({ userId, productId });

  if (existingBundle) {
    // Product already exists in bundle, update quantity and totalPrice
    existingBundle.quantity += quantity;
    existingBundle.totalPrice = existingBundle.quantity * price;
    await existingBundle.save();
    return existingBundle;
  } else {
    // Product does not exist in the bundle, create a new entry
    const newBundle = await Bundle.create({
      userId,
      productId,
      quantity,
      price, 
      totalPrice,
      imageUrl, 
      sellerId,
      description,
      name,
      category,
      subCategory,
      subsubcategory
    });
    return newBundle;
  }

};

// Get bundle by bundleID
export const getBundleByUserId = async (id: mongoose.Types.ObjectId): Promise<IBundleDoc | null> => Bundle.findById(id);

// export const getBundles = async (userId: string) => {
//   const objectId = new mongoose.Types.ObjectId(userId);

//   // Fetch all bundle records for the user
//   const bundles = await Bundle.find({ userId: objectId }).populate('productId');

//   // Fetch discount from the user's profile
//   const user = await User.findById(objectId);
//   const discount = user?.discount ? parseFloat(user.discount) : 0; // Ensure discount is a number

//   // Apply discount to the bundles
//   const updatedBundles = bundles.map(bundle => {
//     const originalPrice = bundle.price; // Price from the bundle
//     const discountedPrice = originalPrice - (originalPrice * discount) / 100; // Apply discount

//     return {
//       ...bundle.toObject(), // Convert Mongoose document to plain object
//       originalPrice,
//       discountedPrice,
//     };
//   });

//   return updatedBundles;
// };

export const getBundles = async (userId: string) => {
  const objectId = new mongoose.Types.ObjectId(userId);

  // Fetch all bundle records for the user
  const bundles = await Bundle.find({ userId: objectId }).populate('productId');

  // Fetch discount from the user's profile
  const user = await User.findById(objectId);
  const discount = user?.discount ? parseFloat(user.discount) : 0; // Ensure discount is a number

  // Initialize totals
  let totalOriginalPrice = 0;
  let totalDiscountedPrice = 0;

  // Apply discount to the bundles
  const cartBundles = bundles.map(bundle => {
    const originalPrice = bundle.price; // Price from the bundle
    const discountedPrice = originalPrice - (originalPrice * discount) / 100; // Apply discount

    // Accumulate totals
    totalOriginalPrice += originalPrice;
    totalDiscountedPrice += discountedPrice;

    return {
      ...bundle.toObject(), // Convert Mongoose document to plain object
      originalPrice,
      discountedPrice,
    };
  });

  return {
    bundles: cartBundles,
    totalOriginalPrice,
    totalDiscountedPrice,
  };
};


export const allGetBundles = async (): Promise<IBundleDoc[]> => {
  const bundles = await Bundle.find(); // Populate related product details if needed
  return bundles;
};

export const removeItem = async (productId: string, userId: string): Promise<IBundleDoc> => {
  console.log('Product ObjectId:', productId);
  console.log('User ObjectId:', userId);
  const bundle = await Bundle.findOneAndDelete({ userId, productId });// this does not delete the

  if (!bundle) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bundle not found for the given user and product');
  }
  return bundle;
};
export const removeItembyid = async ( bundleId: string): Promise<IBundleDoc> => {
 
  const bundle = await Bundle.findOneAndDelete({ bundleId, });// this does not delete the

  if (!bundle) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bundle not found for the given user and product');
  }
  return bundle;
};

// Clear bundle
export const clearBundle = async (userId: string) => {
  // Delete all bundles associated with the userId
  const bundle = await Bundle.deleteMany({ userId });
   if (!bundle) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bundle not found for the given user and product');
  }
  return bundle;
};
