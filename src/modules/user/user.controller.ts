import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as userService from './user.service';

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
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


export const getUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user
    const user = await userService.getUserById(new mongoose.Types.ObjectId(id));
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send(user);
  
});

// export const getUser = catchAsync(async (req: Request, res: Response) => {
//   const { userId, email } = req.params;

//   let user;
//   if (userId && typeof userId === 'string') {
//     user = await userService.getUserById(new mongoose.Types.ObjectId(userId));
//   } else if (email && typeof email === 'string') {
//     user = await userService.getUserByEmail(email);
//   }

//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }

//   res.send(user);
// });

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
const { userId, targetUserId } = req.body;

  if (typeof userId === 'string') {
    const follow = await userService.followUser(userId, targetUserId);
    res.status(200).send({ message: 'User followed', follow });
  } else {
    res.status(400).send({ message: 'Invalid User ID' });
  }
});

// Unfollow a user
export const unfollowUser = catchAsync(async (req: Request, res: Response) => {
  const { userId, targetUserId } = req.body;

  if (typeof userId === 'string') {
    const follower = await userService.unfollowUser(userId, targetUserId);
    res.status(200).send({ message: 'User unfollowed', follower });
  } else {
    res.status(400).send({ message: 'Invalid user ID' });
  }
});

