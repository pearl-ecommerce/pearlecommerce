import mongoose from 'mongoose';
import Cart from './cart.model';
import Product from '../product/product.model';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';
import { ICartDoc, NewCart } from './cart.interfaces';


// Add item to the cart
export const addItem = async (userId: string, productId: string, cartData: NewCart):Promise<ICartDoc> => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  // Check if a cart exists with the same userId and productId
  const existingCart = await Cart.findOne({ userId, 'items.productId': productId });
  if (existingCart) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product already exists in cart');
  }
  // Create a new cart for the userId and the new product
  const cart = await Cart.create(cartData);
  return cart;
};

// Get cart by cartID
export const getCartByUserId = async (id: mongoose.Types.ObjectId): Promise<ICartDoc | null> => Cart.findById(id);

export const getCarts = async (userId: string) => { 
  const objectId = new mongoose.Types.ObjectId(userId);
  return await Cart.find({ userId: objectId }).populate('items.productId');
};


// Update item quantity in the cart
// export const updateItemQuantityplus = async (cartId: string, productId: string) => {
//   // Find the specific cart by its ID
//   const cart = await Cart.findById(cartId);
//   if (!cart) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
//   }
//   // Find the index of the item in the cart's items array
//   const itemIndex = cart.items.findIndex((item) => item.productId.equals(productId));
//   if (itemIndex === -1) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Item not found in cart');
//   }
//   // Increment the quantity of the item
//   // cart.items[itemIndex].quantity += 1;
//   // Update the total price of the cart
//   cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
//   // Save the updated cart
//   await cart.save();
//   return cart;
// };

// Update item quantity in the cart
// export const updateItemQuantityminus = async (cartId: string, productId: string) => {
//   // Find the specific cart by its ID
//   const cart = await Cart.findById(cartId);
//   if (!cart) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
//   }
//   // Find the index of the item in the cart's items array
//   const itemIndex = cart.quantity.findIndex((quantity) => quantity.productId.equals(productId));
//   if (itemIndex === -1) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Item not found in cart');
//   }
//   // Increment the quantity of the item
//   // cart.items[itemIndex].quantity += 1;
//   // Update the total price of the cart
//   cart.totalPrice = cart.quantity.reduce((total, quantity) => total + item.price * item.quantity, 0);
//   // Save the updated cart
//   await cart.save();
//   return cart;
// };


// Remove item from the cart

export const removeItem = async (cartId: string) => {
  const cart = await Cart.findById(cartId);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  // Remove the cart
  await Cart.findByIdAndDelete(cartId);
};

// Clear cart
export const clearCart = async (userId: string) => {
  // Delete all carts associated with the userId
  await Cart.deleteMany({ userId });
};