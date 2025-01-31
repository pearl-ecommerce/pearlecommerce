import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { tokenService } from '../token';
import { emailService } from '../email';
import { IOptions } from '../paginate/paginate';
import * as userService from './user.service';

// create admin
// export const createUser = catchAsync(async (req: Request, res: Response) => {
//   const currentUserId = req.body.userId;
  
//   const user = await userService.createUser(req.body,currentUserId);
//    const response = {
//     status: true,
//     message: 'User created successfully',
//     data: user // Include user and tokens as data
//   };
//   res.status(httpStatus.CREATED).send(response);
// });

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.body.userId;

  const user = await userService.createUser(req.body,currentUserId);
  const tokens = await tokenService.generateAuthTokens(user);   

  // If the user has a generic password, trigger the forgot password flow
  if (
    user.password === 'admin123' || 
    user.password === 'superadmin123' || 
    user.password === 'viewer123'
  ) {
    
    // Call forgotPassword to send a reset token for changing the password
    await emailService.sendResetPasswordEmailCreated(req.body.email,user.password, await tokenService.generateResetPasswordToken(req.body.email));
  }

  // Define a response object with status and message
  const response = {
    status: true,
    message: 'User registered successfully',
    data: { user, tokens } // Include user and tokens as data
  };

  // Send email notifications
  await emailService.sendSuccessfulRegistration(req.body.email, tokens.access.token, req.body.firstName);
  await emailService.sendAccountCreated(req.body.email, req.body.firstName);

  res.status(httpStatus.CREATED).json(response);
});

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role','userId']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await userService.queryUsers(filter, options);

  res.send([result]);
});

export const adminuser = catchAsync(async (req: Request, res: Response) => {
   const  userId = req.body;
  const filter = pick(req.query, ['name', 'role','userId']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await userService.adminUsers(userId,filter, options);
  res.send(result);
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    const user = await userService.getUserById(new mongoose.Types.ObjectId(req.params['userId']));
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
    }
    res.send(user);
  }
});


export const updateUser = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    const user = await userService.updateUserById(new mongoose.Types.ObjectId(req.params['userId']), req.body);
      const response = {
    status: true,
    message: 'User profile updated successfully',
    data: user, // Include user and tokens as data
  };
    res.send(response); 
  }
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['userId'] === 'string') {
    await userService.deleteUserById(new mongoose.Types.ObjectId(req.params['userId']));
 res.status(httpStatus.OK).send({ message: 'User deleted successfully' });  }
});

//follow a user
export const followUser = catchAsync(async (req: Request, res: Response) => {
const { userId, followUserId } = req.body;

  if (typeof userId === 'string') {
    const follow = await userService.followUser(userId, followUserId);
    res.status(200).send({ message: 'User followed', follow });
  } else {
    res.status(400).send({ message: 'Invalid User ID' });
  }
});

// Unfollow a user
export const unfollowUser = catchAsync(async (req: Request, res: Response) => {
  const { userId, unfollowUserId } = req.body;

  if (typeof userId === 'string') {
    const follower = await userService.unfollowUser(userId, unfollowUserId);
    res.status(200).send({ message: 'User unfollowed', follower });
  } else {
    res.status(400).send({ message: 'Invalid user ID' });
  }
});

//get follower and following
export const followers = async (req: Request, res: Response) => {
    const userId  = req.body.userId;
  if (typeof userId === 'string') { 
    const result = await userService.getUserFollowersAndFollowing(userId);
     res.status(httpStatus.OK).json({
      status: 'success',
      data: result,
    });
  } else {
        res.status(400).send({ message: 'Invalid user ID' });
  }
};
export const activate = catchAsync(async (req: Request, res: Response) => {
  const userId = req.query['userId'] as string;
  const user = await userService.activateUser(userId);
  res.status(200).send({ message: 'User activated', user });
});

export const deactivate = catchAsync(async (req: Request, res: Response) => {
  // Extract `userId` from query parameters
  const userId = req.query['userId'] as string;

  // Check if `userId` is valid
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or missing user ID');
  }
  // Fetch products associated with the `userId`
  const user = await userService.deactivateUser(new mongoose.Types.ObjectId(userId));

  // If no products are found, throw a 404 error
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No user found');
  }
  // Send the list of products as a response
 res.status(200).send({ message: 'User deactivated', user });
});

export const userDiscountProducts = catchAsync(async (req: Request, res: Response) => {
  const { userId, discount } = req.body;

  if (typeof userId === 'string') {
    const result = await userService.userDiscountProducts(userId, discount);
    res.status(200).send({ message: 'User discount added', result });
  } else {
    res.status(400).send({ message: 'Invalid User ID' });
  }
});

export const fetchAnalyticsData = catchAsync(async (req: Request, res: Response) => {
  // Extract filters from query parameters
  const userFilter = pick(req.query, ['name', 'role', 'userId']);

  // Call the service with structured input
  const result = await userService.fetchAnalyticsData(userFilter);

  // Send the result back to the client
  res.status(200).send(result);
});



export const userfetchAnalyticsData = catchAsync(async (req: Request, res: Response) => {
  // Extract filters from query parameters
  const userId = req.query['userId'] as string;

  // Call the service with structured input
  const result = await userService.overviewsection(userId);

  // Send the result back to the client
  res.status(200).send(result);
});



export const userfetchVisualChart = catchAsync(async (req: Request, res: Response) => {
  // Extract filters from query parameters
  const userId = req.query['userId'] as string;

  // Call the service with structured input
  const result = await userService.getChartData(userId);

  // Send the result back to the client
  res.status(200).send(result);
});

// . Insights & Suggestions
export const userfetchInsights = catchAsync(async (req: Request, res: Response) => {
  // Extract filters from query parameters
  const userId = req.query['userId'] as string;
   const period = req.query['period'] as string;

  // Call the service with structured input
  const result = await userService.getUserAnalytics(userId, period);

  // Send the result back to the client
  res.status(200).send(result);
});

export const userfetchCustomization = catchAsync(async (req: Request, res: Response) => {
  // Extract filters from query parameters
  const userId = req.query['userId'] as string;
const userFilter = pick(req.query, ['name', 'role', 'userId']);
  // Call the service with structured input
  const result = await userService.getFilteredOrders(userId, userFilter);

  // Send the result back to the client
  res.status(200).send(result);
});