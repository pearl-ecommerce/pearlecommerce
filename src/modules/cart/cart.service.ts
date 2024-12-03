import mongoose from 'mongoose';
import Cart from './cart.model';
import User from '../user/user.model';
import Product from '../product/product.model';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';
// import { ICartDoc, NewCart } from './cart.interfaces';
import { ICartDoc } from './cart.interfaces';



export const addItem = async (userId: string, productId: string,  quantity: number,): Promise<ICartDoc> => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
   // Step 2: Calculate the total price
  const price = product.price;
  const totalPrice = price * quantity;

    const existingCart = await Cart.findOne({ userId, productId });

  if (existingCart) {
    // Product already exists in cart, update quantity and totalPrice
    existingCart.quantity += quantity;
    existingCart.totalPrice = existingCart.quantity * price;
    await existingCart.save();
    return existingCart;
  } else {
    // Product does not exist in the cart, create a new entry
    const newCart = await Cart.create({
      userId,
      productId,
      quantity,
      price,
      totalPrice,
    });
    return newCart;
  }
};



// Get cart by cartID
export const getCartByUserId = async (id: mongoose.Types.ObjectId): Promise<ICartDoc | null> => Cart.findById(id);


export const getCarts = async (userId: string) => {
  const objectId = new mongoose.Types.ObjectId(userId);

  // Fetch all cart records for the user
  const carts = await Cart.find({ userId: objectId }).populate('productId');

  // Fetch discount from the user's profile
  const user = await User.findById(objectId);
  const discount = user?.discount ? parseFloat(user.discount) : 0; // Ensure discount is a number

  // Apply discount to the carts
  const updatedCarts = carts.map(cart => {
    const originalPrice = cart.price; // Price from the cart
    const discountedPrice = originalPrice - (originalPrice * discount) / 100; // Apply discount

    return {
      ...cart.toObject(), // Convert Mongoose document to plain object
      originalPrice,
      discountedPrice,
    };
  });

  return updatedCarts;
};


export const allgetCarts = async (): Promise<ICartDoc[]> => {
  const carts = await Cart.find(); // Populate related product details if needed
  return carts;
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

// export const removeItem = async (cartId: string) => {
//   const cart = await Cart.findById(cartId);
//   if (!cart) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
//   }
//   // Remove the cart
//   await Cart.findByIdAndDelete(cartId);
// };

// export const removeItem = async (productId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => {
//   // Find the cart associated with the userId and containing the productId
//   const cart = await Cart.findOne({ userId, "products.productId": productId });
//   if (!cart) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found or product not in the cart');
//   }
//   // Delete the cart
//   await Cart.deleteOne({ _id: cart._id });
// };
export const removeItem = async (productId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => {

console.log('Product ObjectId:', productId);
console.log('User ObjectId:', userId);
const cart = await Cart.findOneAndDelete({ userId, productId });
 
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found for the given user and product');
  }
  return { message: 'Cart item removed successfully' };
};
// Clear cart
export const clearCart = async (userId: string) => {
  // Delete all carts associated with the userId
  await Cart.deleteMany({ userId });
};
