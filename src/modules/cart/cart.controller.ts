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
  const { userId } = req.params;
  if (!userId || typeof userId !== 'string') {
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


// Remove item from the cart
export const removeItemFromCart = catchAsync(async (req: Request, res: Response) => {
  const { cartId } = req.query; // Extract cartId from query params

  if (!mongoose.Types.ObjectId.isValid(cartId as string)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid cartId');
  }
  // Call the service to delete the cart
  await cartService.removeItem(cartId as string);

  res.status(httpStatus.OK).send({
    status: true,
    message: 'Cart deleted successfully',
  });
});

// Clear the cart
export const clearCart = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.query; // Extract userId from query parameters

  if (!mongoose.Types.ObjectId.isValid(userId as string)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid userId');
  }

  // Call the service to clear carts for the user
  await cartService.clearCart(userId as string);

  res.status(httpStatus.NO_CONTENT).send();
});
