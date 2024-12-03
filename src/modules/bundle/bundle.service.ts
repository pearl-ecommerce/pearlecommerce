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
  const totalPrice = price * quantity;

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
    });
    return newBundle;
  }
};

// Get bundle by bundleID
export const getBundleByUserId = async (id: mongoose.Types.ObjectId): Promise<IBundleDoc | null> => Bundle.findById(id);

export const getBundles = async (userId: string) => {
  const objectId = new mongoose.Types.ObjectId(userId);

  // Fetch all bundle records for the user
  const bundles = await Bundle.find({ userId: objectId }).populate('productId');

  // Fetch discount from the user's profile
  const user = await User.findById(objectId);
  const discount = user?.discount ? parseFloat(user.discount) : 0; // Ensure discount is a number

  // Apply discount to the bundles
  const updatedBundles = bundles.map(bundle => {
    const originalPrice = bundle.price; // Price from the bundle
    const discountedPrice = originalPrice - (originalPrice * discount) / 100; // Apply discount

    return {
      ...bundle.toObject(), // Convert Mongoose document to plain object
      originalPrice,
      discountedPrice,
    };
  });

  return updatedBundles;
};

export const allGetBundles = async (): Promise<IBundleDoc[]> => {
  const bundles = await Bundle.find(); // Populate related product details if needed
  return bundles;
};

export const removeItem = async (productId: string, userId: string): Promise<IBundleDoc> => {
  console.log('Product ObjectId:', productId);
  console.log('User ObjectId:', userId);
  const bundle = await Bundle.findOneAndDelete({ userId, productId });

  if (!bundle) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bundle not found for the given user and product');
  }
  return bundle;
};

// Clear bundle
export const clearBundle = async (userId: string) => {
  // Delete all bundles associated with the userId
  await Bundle.deleteMany({ userId });
};
