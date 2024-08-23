import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Order from './order.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { IOrderDoc, NewOrder, UpdateOrderBody } from './order.interfaces';
import User from '../user/user.model';
import axios from 'axios'; // You might need to install axios for HTTP requests

const PAYSTACK_SECRET_KEY = 'your-paystack-secret-key'; // Replace with your actual Paystack secret key
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Function to initiate payment with Paystack
const paystackInitiatePayment = async (amount: number, email: string) => {
  try {
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        amount: amount * 100, // Paystack expects the amount in kobo
        email,
        callback_url: 'http://localhost:3000/v1/order/verify-payment', // Replace with your callback URL
// callback_url: 'http://161.35.114.79/v1/order/verify-payment',
        
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Payment initiation failed');
  }
};

// Function to verify payment with Paystack
const verifyPayment = async (reference: string) => {
  try {
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Payment verification failed');
  }
};

// Service to initiate payment and create order
export const createOrder = async (orderBody: NewOrder): Promise<any> => {
  const { amount, email } = orderBody;
  const paymentInitiation = await paystackInitiatePayment(amount, email);
  return paymentInitiation;
};

// Service to verify payment and create order
export const verifyAndCreateOrder = async (orderBody: NewOrder, reference: string): Promise<IOrderDoc> => {
  const paymentVerification = await verifyPayment(reference);

  if (paymentVerification.data.status !== 'success') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Payment failed. Please try again.');
  }

  return Order.create(orderBody);
};

export const queryOrders = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const orders = await Order.paginate(filter, options);
  return orders;
};

export const getOrderById = async (id: mongoose.Types.ObjectId): Promise<IOrderDoc | null> => Order.findById(id);

export const updateOrderById = async (
  orderId: mongoose.Types.ObjectId,
  updateBody: UpdateOrderBody
): Promise<IOrderDoc | null> => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  Object.assign(order, updateBody);
  await order.save();
  return order;
};

export const deleteOrderById = async (orderId: mongoose.Types.ObjectId): Promise<IOrderDoc | null> => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  await order.remove();
  return order;
};

export const createOrderAndUpdateUser = async (userId: mongoose.Types.ObjectId, orderData: NewOrder) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Create the order
  const order = await Order.create({
    ...orderData,
    ownerId: userId,
  });

  // Update user role
  user.role = 'seller';
  await user.save();

  return { user, order };
};
