import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Order from './order.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { IOrderDoc, NewOrder, UpdateOrderBody } from './order.interfaces';
import User from '../user/user.model';
import Pricing from '../pricing/pricing.model';

// import Product from '../product/product.model';

import axios from 'axios'; // You might need to install axios for HTTP requests
// type OrderType = typeof Order & Document;


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
        // callback_url: 'www.reselii.com/v1/order/verify-and-create-order',
                callback_url: 'https://reselli-frontend.vercel.app/success-verification',
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
  console.log('reference number', reference);
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

// export const createOrder = async (orderBody: NewOrder): Promise<any> => {
//   const { amount, email } = orderBody;
//   // Step 1: Create a new order with 'pending' status
//   const newOrder = await Order.create({
//     ...orderBody,
//     paymentStatus: 'pending', // Default status
//   });
//   try {
//     // Step 2: Initiate payment with Paystack
//     const paymentInitiation = await paystackInitiatePayment(amount, email);

//     if (!paymentInitiation?.data?.reference || !paymentInitiation?.data?.authorization_url) {
//       throw new Error('Failed to initiate payment');
//     }

//     // Step 3: Update the order with the payment reference and URL
//     newOrder.reference = paymentInitiation.data.reference;
//     await newOrder.save();

//     // Step 4: Return the order ID and payment URL
//     return {
//       orderId: newOrder.id,
//       paymentUrl: paymentInitiation.data.authorization_url,
//       message: 'Payment initiated successfully',
//     };
//   } catch (error) {
//     // If payment initiation fails, remove the created order
//     await Order.findByIdAndDelete(newOrder.id);
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Payment initiation failed');
//   }
// };

export const createOrder = async (orderBody: NewOrder): Promise<any> => {
  const { amount, email } = orderBody;

  // Step 1: Retrieve the price (percentage) from the Pricing table
  const pricing = await Pricing.findOne(); // Update this query to get the specific pricing if needed
  if (!pricing || !pricing.price) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pricing information not found');
  }

  const pricePercentage = pricing.price;

  // Step 2: Calculate revenue, amount, and profit
  const revenue = amount; // Revenue is the full amount
  const profit = (revenue * pricePercentage) / 100; // Profit is the percentage of the revenue
  const finalAmount = revenue - profit; // Amount is revenue minus profit

  // Step 3: Create a new order with calculated values
  const newOrder = await Order.create({
    ...orderBody,
    paymentStatus: 'pending', // Default status
    revenue,
    amount: finalAmount,
    profit,
  });

  try {
    // Step 4: Initiate payment with Paystack
    const paymentInitiation = await paystackInitiatePayment(amount, email);

    if (!paymentInitiation?.data?.reference || !paymentInitiation?.data?.authorization_url) {
      throw new Error('Failed to initiate payment');
    }

    // Step 5: Update the order with the payment reference and URL
    newOrder.reference = paymentInitiation.data.reference;
    await newOrder.save();

    // Step 6: Return the order ID and payment URL
    return {
      orderId: newOrder.id,
      paymentUrl: paymentInitiation.data.authorization_url,
      message: 'Payment initiated successfully',
    };
  } catch (error) {
    // If payment initiation fails, remove the created order
    await Order.findByIdAndDelete(newOrder.id);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Payment initiation failed');
  }
};


export const queryOrders = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const orders = await Order.paginate(filter, options);
  return orders;
};

// export const queryUsersWithSales = async (filter: Record<string, any>, options: IOptions): Promise<any> => {
//   const usersWithSales = await User.aggregate([
//     // Step 1: Match users based on the provided filter
//     { $match: filter },
//     // Step 2: Lookup sales from the OrdersItem collection
//     {
//       $lookup: {
//         from: 'ordersItem', // Collection name for OrdersItem
//         localField: '_id', // _id in the Users collection
//         foreignField: 'sellerId', // sellerId in the OrdersItem collection
//         as: 'sales', // Name of the joined field
//       },
//     },
//     // Step 3: Add fields for totalSales and totalOrders
//     {
//       $addFields: {
//         totalSales: { $sum: '$sales.amount' }, // Sum up the `amount` field in sales
//         totalOrders: { $size: '$sales' }, // Count the number of sales
//       },
//     },
//     // Step 4: Project the desired fields
//     {
//       $project: {
//         _id: 1,
//         name: 1,
//         email: 1,
//         createdAt: 1,
//         totalSales: 1,
//         totalOrders: 1,
//       },
//     },
//     // Step 5: Sort by totalSales in descending order (null values will be sorted last)
//     { $sort: { totalSales: -1 } },
//     // Step 6: Apply pagination
//     { $skip: options.page * options.limit },
//     { $limit: options.limit },
//   ]);

//   return usersWithSales;
// };

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

// Update the functions with explicit typing
export const revenue = async (
  filter: Record<string, any>
): Promise<{ totalRevenue: number }> => {
  try {
    // Aggregate total revenue based on the filter
    const totalRevenueResult = await Order.aggregate([
      {
        $match: filter, // Apply the filter for matching orders
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$revenue' }, // Sum up the 'revenue' field
        },
      },
    ]);
    // Extract the total revenue amount
    const totalRevenue =
      totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;

    return { totalRevenue };
  } catch (error) {
    throw new Error('Unable to calculate revenue.');
  }
};


export const profitcompany = async (
  filter: Record<string, any>
): Promise<{ profit: number }> => {
  try {
    // Aggregate total profit based on the filter
    const profitResult = await Order.aggregate([
      {
        $match: filter, // Apply the filter for matching orders
      },
      {
        $group: {
          _id: null,
          totalProfit: { $sum: '$profit' }, // Sum up the 'profit' field
        },
      },
    ]);

    // Extract the total profit amount
    const profit = profitResult.length > 0 ? profitResult[0].totalProfit : 0;

    return { profit };
  } catch (error) {
    throw new Error('Unable to calculate profit.');
  }
};



