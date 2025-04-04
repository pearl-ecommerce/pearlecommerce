import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as orderService from './order.service';

// Controller to create an order and initiate payment
export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const orderBody = req.body;
  
  // Initiate payment and get the response from Paystack
  const paymentInitiation = await orderService.createOrder(orderBody);
  
  // Respond with the payment initiation data
 return res.status(httpStatus.CREATED).send(paymentInitiation);
});

// Controller to verify payment and create the order
export const verifyAndCreateOrder = catchAsync(async (req: Request, res: Response) => {
  const { reference } = req.query;
  if (!reference) {
  return res.status(httpStatus.BAD_REQUEST).send({ message: 'Reference is required' });
  }
 // const updatedOrder = await orderService.verifyAndUpdateOrder(reference as string);
  return res.status(httpStatus.OK).json({
    message: 'Payment verified and order updated successfully',
    // order: updatedOrder,
  });
});


export const getOrders = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'userId','sellerId']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await orderService.queryOrders(filter, options);
  res.send(result);
});


 
export const getallsales = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'Id']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await orderService.queryOrders(filter, options);
  res.send(result);
});


export const getOrder = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['orderId'] === 'string') {
    const order = await orderService.getOrderById(new mongoose.Types.ObjectId(req.params['orderId']));
    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }
    res.send(order);
  }
});
 
export const updateOrder = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['orderId'] === 'string') {
    const order = await orderService.updateOrderById(new mongoose.Types.ObjectId(req.params['orderId']), req.body);
    res.send(order);
  }
});

export const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['orderId'] === 'string') {
    await orderService.deleteOrderById(new mongoose.Types.ObjectId(req.params['orderId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});

// In order.controller.ts
export const becomeSellerAndCreateOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id; // Assuming you have authentication middleware
  const orderData = req.body;

  const { user, order } = await orderService.createOrderAndUpdateUser(userId, orderData);

  res.status(httpStatus.CREATED).send({ user, order });
});

 
// export const revenue = catchAsync(async (req: Request, res: Response) => {
//   const filter = pick(req.query, ['name', 'userId','sellerId']);
//   const result = await orderService.calculateRevenueAndProfit(filter);
//   res.send(result);
// });
