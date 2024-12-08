import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as userService from './user.service';

// create admin
export const createUser = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.body.userId;
  
  const user = await userService.createUser(req.body,currentUserId);
   const response = {
    status: true,
    message: 'User created successfully',
    data: user // Include user and tokens as data
  };
  res.status(httpStatus.CREATED).send(response);
});

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role','userId']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

export const adminuser = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role','userId']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await userService.adminUsers(filter, options);
  res.send(result);
});


export const getUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user
    const user = await userService.getUserById(new mongoose.Types.ObjectId(id));
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send(user);
  
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

export const deactivate = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.query;

  // Ensure userId is a string
  if (typeof userId === 'string') {
    const user = await userService.deactivateUser(userId);
    res.status(200).send({ message: 'User deactivated', user });
  } else {
    res.status(400).send({ message: 'Invalid query parameter: userId must be a string' });
  }
});


export const activate = async (req: Request, res: Response) => {
  const { userId } = req.query;

  // Ensure userId is a string
  if (typeof userId === 'string') {
    const result = await userService.activateUser(userId);
    res.status(httpStatus.OK).json({
      status: 'success',
      data: result,
    });
  } else {
    res.status(400).send({ message: 'Invalid query parameter: userId must be a string' });
  }
};


export const userDiscountProducts = catchAsync(async (req: Request, res: Response) => {
  const { userId, discount } = req.body;

  if (typeof userId === 'string') {
    const result = await userService.userDiscountProducts(userId, discount);
    res.status(200).send({ message: 'User discount added', result });
  } else {
    res.status(400).send({ message: 'Invalid User ID' });
  }
});