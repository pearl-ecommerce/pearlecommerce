import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import * as cartService from './cart.service';

// Add item to the cart
export const createCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.body.userId; 
  const productId = req.body.productId; 

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid userId or productId');
  }
  const cart = await cartService.addItem(userId, productId, req.body);
  res.status(httpStatus.OK).send({
    status: true,
    message: 'Item added to cart successfully',
    data: cart,
  });
});

// Get user's cart
export const getCarts = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.body;
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or missing userId');
  }
  const cart = await cartService.getCarts(userId);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  res.status(httpStatus.OK).send({
    status: true,
     message: 'Carts retrieved successfully',
    data: cart,
  });
});


// Update item quantity in the cart plus quantity
// export const updateItemQuantityplus = catchAsync(async (req: Request, res: Response) => {
//   const { userId, productId } = req.body;

//   if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid userId or productId');
//   }

//   const cart = await cartService.updateItemQuantityplus(userId, productId);
//   res.status(httpStatus.OK).send({
//     status: true,
//     message: 'Item quantity updated successfully',
//     data: cart,
//   });
// });

// Update item quantity in the cart minus the quantity


// export const removeItemFromCart = catchAsync(async (req: Request, res: Response) => {
//   // Extract `userId` from query parameters
//   const cartId = req.body['cartId'] as string;

//   // Check if `userId` is valid
//   if (!cartId || !mongoose.Types.ObjectId.isValid(cartId)) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or missing user ID');
//   }
//   // Fetch products associated with the `userId`
//    await cartService.removeItem(new mongoose.Types.ObjectId(cartId));

//     res.status(httpStatus.OK).send({
//     status: true,
//     message: 'Cart removed',
//   });
// });

export const removeItemFromCart = catchAsync(async (req: Request, res: Response) => {
  const { productId, userId } = req.body;

  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or missing product ID');
  }
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or missing user ID');
  }
  await cartService.removeItem(userId, productId);
 
  res.status(httpStatus.OK).send({
    status: true,
    message: 'Item removed from cart',
  });
});


// Clear the cart
export const clearCart = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.query; // Extract userId from query parameters

  // Ensure userId is a valid string before validation
  if (!userId || !mongoose.Types.ObjectId.isValid(userId as string)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid userId');
  }

  // Call the service to clear carts for the user
  await cartService.clearCart(userId as string);

  res.status(httpStatus.NO_CONTENT).send();
});;
