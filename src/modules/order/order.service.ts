import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Order from './order.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { IOrderDoc, NewOrder, UpdateOrderBody } from './order.interfaces';
import User from '../user/user.model';
import axios from 'axios'; // You might need to install axios for HTTP requests

const PAYSTACK_SECRET_KEY = 'sk_test_9dfacbeaefe4e9254d1f7ae6ab149bec0270857e'; // Replace with your actual Paystack secret key
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Function to initiate payment with Paystack
const paystackInitiatePayment = async (amount: number, email: string) => {
  try {
     console.log('amount:', amount);
    console.log('email:', email);
    const response = await axios.post(
      `https://api.paystack.co/transaction/initialize`,
      {
        amount: amount * 100, // Paystack expects the amount in kobo
        email,
      
          // callback_url: 'http://localhost:3000/v1/order/verify-payment', // Replace with your callback URL
          callback_url: 'www.reselii.com/v1/order/verify-and-create-order',
        
      },
      {
        headers: {
          Authorization: `Bearer sk_test_9dfacbeaefe4e9254d1f7ae6ab149bec0270857e`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Payments initiation failed');
  }
};

// Function to verify payment with Paystack
export const verifyAndUpdateOrder = async (reference: string) => {
  try {
    // Step 1: Verify payment with Paystack
    const response = await axios.get(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const { status, data } = response.data;

    if (!status || data.status !== 'success') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Payment verification failed');
    }
    // Step 2: Find the order with the corresponding reference
    const order = await Order.findOne({ reference });
    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }
    // Step 3: Update the order with payment details
    order.paymentStatus = 'completed';
    order.paymentDetails = {
      transactionId: data.id,
      amount: data.amount / 100, // Convert from kobo to NGN
      paidAt: data.paid_at,
    };
    await order.save();
    return order;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Payment verification failed');
  }
};
 
// Service to initiate payment and create order
export const createOrder = async (orderBody: NewOrder): Promise<any> => {

    const { amount, email } = orderBody;

    // Step 1: Initiate payment
    const paymentInitiation = await paystackInitiatePayment(amount, email);

    if (!paymentInitiation?.data?.reference || !paymentInitiation?.data?.authorization_url) {
      throw new Error('Failed to initiate payment');
    }
  // Step 2: Create a new order with 'pending' status
  if (paymentInitiation) {
        const newOrder = await Order.create({
      ...orderBody,
      reference: paymentInitiation.data.reference,
      paymentStatus: 'pending', // Default status
      paymentUrl: paymentInitiation.data.authorization_url,
    });

    // Step 3: Return the new order and payment URL
    return {
      orderId: newOrder.id,
      paymentUrl: paymentInitiation.data.authorization_url,
      message: 'Payment initiated successfully',
    };
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'order not created');
  }

  
};
;

// Service to verify payment and create order
// export const verifyAndCreateOrder = async (reference: string) => {
//   const paymentVerification = await verifyPayment(reference);

//   if (paymentVerification.data.status !== 'success') {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Payment failed. Please try again.');
//   }

// };

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
