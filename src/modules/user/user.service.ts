import httpStatus from 'http-status';
import mongoose from 'mongoose';
import User from './user.model';
import Order from '../order/order.model';
import Product from '../product/product.model';

import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreatedUser, UpdateUserBody, IUserDoc, NewRegisteredUser } from './user.interfaces';

/**
 * Create a user
 * @param {NewCreatedUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const createUser = async (userBody: NewCreatedUser, currentUserId: string | null): Promise<IUserDoc> => {
  // Check if currentUserId is provided and if the user has an admin role
  if (!currentUserId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'User ID is required');
  }
  const currentUser = await User.findById(currentUserId); // Fetch the current user's details from the database
  if (!currentUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (currentUser.role !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Only admins can create users');
  }
  // Check if the email is already taken
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  // Create the new user
  return User.create(userBody);
};
 

/**
 * Register a user
 * @param {NewRegisteredUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const registerUser = async (userBody: NewRegisteredUser): Promise<IUserDoc> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
// export const queryUsers = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
//   const users = await User.paginate(filter, options);
//   return users;
// };
export const queryUsers = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const users = await User.paginate(filter, {
    ...options
  });
  return users;
};

export const adminUsers = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const adminFilter = { ...filter, role: 'admin' }; // Ensure role is admin
  const users = await User.paginate(adminFilter, options);
  return users;
};

/**
 * Get user by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IUserDoc | null>}
 */
// export const getUserById = async (id: mongoose.Types.ObjectId): Promise<IUserDoc | null> => User.findById(id);
export const getUserById = async (
  id: mongoose.Types.ObjectId
): Promise<{ user: IUserDoc | null; totalSales: number }> => {
  try {
    // Fetch the user by ID
    const user = await User.findById(id);
    if (!user) {
      return { user: null, totalSales: 0 };
    }

    // Calculate total sales from the Orders table for the user
    const totalSalesResult = await Order.aggregate([
      {
        $match: {
          sellerId: id, // Match orders belonging to the user
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' }, // Sum up the 'amount' field
        },
      },
    ]);

    // Extract the total sales amount
    const totalSales =
      totalSalesResult.length > 0 ? totalSalesResult[0].totalAmount : 0;

    return {
      user,
      totalSales,
    };
  } catch (error) {
    console.error('Error fetching user or calculating sales:', error);
    throw new Error('Unable to fetch user or calculate sales.');
  }
};
/**
 * Get user by email
 * getUserByEmail
 * @param {string} email
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserByEmail = async (email: string): Promise<IUserDoc | null> => User.findOne({ email });

/**
 * Update user by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {UpdateUserBody} updateBody
 * @returns {Promise<IUserDoc | null>}
 */
export const updateUserById = async (
  userId: mongoose.Types.ObjectId,
  updateBody: UpdateUserBody
): Promise<IUserDoc | null> => {
const user = await User.findById(userId);  
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IUserDoc | null>}
 */
export const deleteUserById = async (userId: mongoose.Types.ObjectId): Promise<IUserDoc | null> => {
const user = await User.findById(userId);  
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
}; 
export const followUser = async (userId: string, followUserId: string) => {
  const user = await User.findById(userId);
  const targetUser = await User.findById(followUserId);

  if (!user || !targetUser) {
    throw new Error('User not found');
  }

  const userIdStr = new mongoose.Types.ObjectId(userId).toString();
  const targetUserIdStr = new mongoose.Types.ObjectId(followUserId).toString();

  // Check if the user is already following the target user
  if (!user.following.map(id => id.toString()).includes(targetUserIdStr)) {
    user.following.push(new mongoose.Types.ObjectId(followUserId));
    await user.save();
  }

  // Check if the target user already has the user as a follower
  if (!targetUser.followers.map(id => id.toString()).includes(userIdStr)) {
    targetUser.followers.push(new mongoose.Types.ObjectId(userId));
    await targetUser.save();
  }

  return targetUser;
};
export const unfollowUser = async (userId: string, unfollowUserId: string) => {
  const user = await User.findById(userId);
  const targetUser = await User.findById(unfollowUserId);

  if (!user || !targetUser) {
    throw new Error('User not found');
  }

  const userIdStr = new mongoose.Types.ObjectId(userId).toString();
  const targetUserIdStr = new mongoose.Types.ObjectId(unfollowUserId).toString();

  user.following = user.following.filter(id => id.toString() !== targetUserIdStr);
  await user.save();

  targetUser.followers = targetUser.followers.filter(id => id.toString() !== userIdStr);
  await targetUser.save();

  return targetUser;
};

export const getUserFollowersAndFollowing = async (userId: string): Promise<IUserDoc | null> => {
  try {
    const user = await User.findById(userId)
      .populate({
        path: 'followers',
        select: 'firstName',
      })
      .populate({
        path: 'following',
        select: 'firstName',
      });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    console.error('Error fetching followers and following:', error);
    throw new Error('Failed to retrieve followers and following');
  }
};

export const deactivateUser = async (userId: mongoose.Types.ObjectId): Promise<IUserDoc> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  if (user.active === false) {
    throw new Error('User is already deactivated');
  }
  user.active = false;
  await user.save();
  return user;
};


export const activateUser = async (userId: string): Promise<IUserDoc> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  if (user.active === true) {
    throw new Error('User is already active');
  }
  user.active = true; 
  await user.save();
  return user;
};

export const userDiscountProducts = async (userId:string, discount: string): Promise<IUserDoc | null> => {
    const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  } 
  user.discount = discount;

  await user.save();
  console.log("User updated successfully:", user);
  return user;
};

export const oauthSignup = async (userReq: any) => {
  const { firstName,
    lastName,
    email,
    role } = userReq
  let user;
  let userDetails = await User.findOne({ email })
  if (userDetails) {
    return userDetails
  }
  user = new User({
    firstName,
    lastName,
    email,
    role,
    platform: "google",
  
  });
  return await User.create(user);

}

export const fetchAnalyticsData = async (
  filter: Record<string, any>
): Promise<{
  totalProducts: number;
  totalNewProducts: number;
  totalUsers: number;
  totalNewUsers: number;
  totalRevenue: number;
  totalProfit: number;
}> => {
  try {
    // Get the start and end of the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59

    // Create a filter for today's data
    const newFilter = {
      ...filter,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    };

    // Fetch product data
    const totalProducts = await Product.countDocuments(filter);
    const totalNewProducts = await Product.countDocuments(newFilter);

    // Fetch user data
    const totalUsers = await User.countDocuments(filter);
    const totalNewUsers = await User.countDocuments(newFilter);

    // Aggregate revenue and profit
    const result = await Order.aggregate([
      {
        $match: filter, // Apply the same filter for orders if applicable
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$revenue' }, // Sum up the 'revenue' field
          totalProfit: { $sum: '$profit' },   // Sum up the 'profit' field
        },
      },
    ]);
    const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;
    const totalProfit = result.length > 0 ? result[0].totalProfit : 0;

    return {
      totalProducts,
      totalNewProducts,
      totalUsers,
      totalNewUsers,
      totalRevenue,
      totalProfit,
    };
  } catch (error) {
    throw new Error('Unable to fetch analytics data.');
  }
};


export const overviewsection = async (
  customerId: string
): Promise<{
  totalProducts: number;
  totalNewProducts: number;
  totalItemsBought: {
    count: number;
    totalSpent: number;
  };
  totalItemsSold: {
    count: number;
    totalEarned: number;
  };
  netBalance: number;
}> => {
  try {
    // Validate customer existence
    const customer = await User.findById(customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    // Get the start and end of the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59

    // Define filters for products and orders associated with the customer
    const productFilter = { userId: customerId }; // Products created by the customer
    const newProductFilter = {
      ...productFilter,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    };
    const boughtFilter = { userId: customerId }; // Orders where the customer is the buyer
    const soldFilter = { sellerId: customerId }; // Orders where the customer is the seller

    // Fetch product data
    const totalProducts = await Product.countDocuments(productFilter);
    const totalNewProducts = await Product.countDocuments(newProductFilter);

    // Fetch data for items bought
    const itemsBought = await Order.find(boughtFilter);
    const totalItemsBoughtCount = itemsBought.length;
    const totalSpent = itemsBought.reduce((sum, item) => sum + item.amount, 0);

    // Fetch data for items sold
    const itemsSold = await Order.find(soldFilter);
    const totalItemsSoldCount = itemsSold.length;
    const totalEarned = itemsSold.reduce((sum, item) => sum + item.amount, 0);

    // Calculate net balance
    const netBalance = totalEarned - totalSpent;

    return {
      totalProducts,
      totalNewProducts,
      totalItemsBought: {
        count: totalItemsBoughtCount,
        totalSpent,
      },
      totalItemsSold: {
        count: totalItemsSoldCount,
        totalEarned,
      },
      netBalance,
    };
  } catch (error) {
    throw new Error('Unable to fetch customer activity summary.');
  }
};

interface ChartData {
  barChart: Array<{ period: string; itemsBought: number; itemsSold: number }>;
  pieChart: Array<{ category: string; spending: number }>;
  lineChart: Array<{ period: string; revenue: number }>;
   bestSellingCategory: { category: string; totalQuantity: number; totalAmount: number } | null;
  mostBoughtItems: { productId: string; totalQuantity: number; totalAmount: number }[];
  trendAnalysis: { totalSpending: number; trend: string } | null;
}

export const getChartData = async (userId: string): Promise<ChartData> => {
  // Validate user existence
  // (Optional) Add a check for the user in your `User` model.

  // Date range for monthly grouping
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const now = new Date();

  // Bar Chart: Items Bought vs. Sold
  const barChartData = await Order.aggregate([
    {
      $match: {
        $or: [{ userId }, { sellerId: userId }],
        createdAt: { $gte: startOfYear, $lte: now },
      },
    },
    {
      $addFields: {
        month: { $month: '$createdAt' },
      },
    },
    {
      $group: {
        _id: { month: '$month', type: { $cond: [{ $eq: ['$userId', userId] }, 'bought', 'sold'] } },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: '$_id.month',
        itemsBought: {
          $sum: { $cond: [{ $eq: ['$_id.type', 'bought'] }, '$count', 0] },
        },
        itemsSold: {
          $sum: { $cond: [{ $eq: ['$_id.type', 'sold'] }, '$count', 0] },
        },
      },
    },
      {
    $project: {
      period: {
        $concat: [
          { $toString: '$_id.month' }, // Month
          '-', 
          { $toString: '$_id.year' }  // Year
        ]
      },
      itemsBought: 1,
      itemsSold: 1,
    },
  },
  {
    $sort: { 'period': 1 }, // Sort by period
  }
  ]);

  // Pie Chart: Spending Distribution by Category
  const pieChartData = await Order.aggregate([
    {
      $match: { userId },
    },
    {
      $unwind: '$items',
    },
    {
      $lookup: {
        from: 'products', // Replace with your Product collection name if different
        localField: 'items.productId',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    {
      $unwind: '$productDetails',
    },
    {
      $group: {
        _id: '$productDetails.category', // Replace with your product category field
        spending: { $sum: '$items.quantity' },
      },
    },
    {
      $project: {
        _id: 0,
        category: '$_id',
        spending: 1,
      },
    },
  ]);

  // Line Chart: Revenue Growth Over Time
  const lineChartData = await Order.aggregate([
    {
      $match: { sellerId: userId, createdAt: { $gte: startOfYear, $lte: now } },
    },
    {
      $addFields: {
        month: { $month: '$createdAt' },
      },
    },
    {
      $group: {
        _id: { month: '$month' },
        revenue: { $sum: '$amount' },
      },
    },
    {
      $project: {
        _id: 0,
        period: { $concat: [{ $toString: '$_id.month' }, '-2025'] },
        revenue: 1,
      },
    },
    { $sort: { period: 1 } },
  ]);

  return {
    barChart: barChartData,
    pieChart: pieChartData,
    lineChart: lineChartData,
     bestSellingCategory: null, // Default value
    mostBoughtItems: [], // Default value
    trendAnalysis: null, // Default value
  };
};



export const getUserAnalytics = async (userId: string, period: string): Promise<ChartData> => {
  if (!userId || !period) {
    throw new Error('Invalid input parameters');
  }

  // Helper function to get the Best Selling Category
  const getBestSellingCategory = async () => {
    try {
      const result = await Order.aggregate([
        { $match: { userId } },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.category',
            totalQuantity: { $sum: '$items.quantity' },
            totalAmount: { $sum: { $multiply: ['$items.quantity', '$items.amount'] } },
          },
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 1 },
      ]);
      return result[0]
        ? { category: result[0]._id, totalQuantity: result[0].totalQuantity, totalAmount: result[0].totalAmount }
        : null;
    } catch (error) {
      console.error('Error fetching best selling category:', error);
      throw error;
    }
  };

  // Helper function to get the Most Bought Items
  const getMostBoughtItems = async () => {
    try {
      const result = await Order.aggregate([
        { $match: { userId } },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.productId',
            totalQuantity: { $sum: '$items.quantity' },
            totalAmount: { $sum: { $multiply: ['$items.quantity', '$items.amount'] } },
          },
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 5 },
      ]);
      return result.map(item => ({
        productId: item._id,
        totalQuantity: item.totalQuantity,
        totalAmount: item.totalAmount,
      }));
    } catch (error) {
      console.error('Error fetching most bought items:', error);
      throw error;
    }
  };

  // Helper function to get Trend Analysis
  const getTrendAnalysis = async () => {
    try {
      const currentDate = new Date();
      let startDate: Date;

      if (period === 'monthly') {
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      } else if (period === 'weekly') {
        const weekStart = currentDate.getDate() - currentDate.getDay();
        startDate = new Date(currentDate.setDate(weekStart));
      } else {
        throw new Error('Invalid period');
      }

      const result = await Order.aggregate([
        { $match: { userId, createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: null,
            totalSpending: { $sum: '$amount' },
          },
        },
      ]);

      return result[0]
        ? {
            totalSpending: result[0].totalSpending,
            trend: result[0].totalSpending > 0 ? 'Spending' : 'No Spending',
          }
        : null;
    } catch (error) {
      console.error('Error fetching trend analysis:', error);
      throw error;
    }
  };

  // Fetch the analytics data
  const [bestSellingCategory, mostBoughtItems, trendAnalysis] = await Promise.all([
    getBestSellingCategory(),
    getMostBoughtItems(),
    getTrendAnalysis(),
  ]);

  return {
    bestSellingCategory,
    mostBoughtItems,
    trendAnalysis,
     barChart: [],
    pieChart: [],
    lineChart: [],
  };
};


interface FilterOptions {
  startDate?: string; // ISO Date string
  endDate?: string;   // ISO Date string
  category?: string;
  paymentMethod?: string;
}


   
  export const  getFilteredOrders = async(userId: string, filters: FilterOptions)=>{
    try {
      const query: any = { userId };

      // Add date range filtering
      if (filters.startDate || filters.endDate) {
        query.createdAt = {
          ...(filters.startDate ? { $gte: new Date(filters.startDate) } : {}),
          ...(filters.endDate ? { $lte: new Date(filters.endDate) } : {}),
        };
      }

      // Add category filtering
      if (filters.category) {
        query['items.category'] = filters.category;
      }

      // Add payment method filtering
      if (filters.paymentMethod) {
        query.paymentMethod = filters.paymentMethod;
      }

      // Fetch the filtered orders
      const orders = await Order.find(query).populate('items.productId'); // Populate related data if necessary

      return orders;
    } catch (error) {
      console.error('Error fetching filtered orders:', error);
      throw new Error('Failed to fetch filtered orders');
    }
  }

