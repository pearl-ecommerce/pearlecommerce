import httpStatus from 'http-status';
import mongoose from 'mongoose';
import User from './user.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreatedUser, UpdateUserBody, IUserDoc, NewRegisteredUser } from './user.interfaces';

/**
 * Create a user
 * @param {NewCreatedUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const createUser = async (userBody: NewCreatedUser): Promise<IUserDoc> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
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
export const queryUsers = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const users = await User.paginate(filter, options);
  return users;
};


/**
 * Get user by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserById = async (id: mongoose.Types.ObjectId): Promise<IUserDoc | null> => User.findById(id);

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
  const user = await getUserById(userId);
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
  const user = await getUserById(userId);
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

// export const getUserFollowersAndFollowing = async (userId: string): Promise<IUserDoc | null> => {
//   try {
//     const user = await User.findById(userId)
//       .populate({
//         path: 'followers',
//         select: 'firstName lastName',
//       })
//       .populate({
//         path: 'following',
//         select: 'firstName lastName',
//       });

//     if (!user) {
//       throw new Error('User not found');
//     }

//     // Map the followers and following arrays
//     const followers = user.followers.map((follower) => ({
//       id: follower._id.toString(),
//       firstName: follower.firstName,
//       lastName: follower.lastName,
//     }));

//     const following = user.following.map((followingUser) => ({
//       id: followingUser._id.toString(),
//       firstName: followingUser.firstName,
//       lastName: followingUser.lastName,
//     }));

//      return { followers, following };
//   } catch (error) {
//     console.error(error);
//     throw new Error('Could not fetch followers and following');
//   }
// };

export const oauthSignup = async (userReq: any) => {
  const { firstName,
    lastName,
    email,
    role } = userReq

  let user;
  // const { _json: details } = userReq;
  // const firstName = details.first_name || details.given_name;
  // const lastName = details.last_name || details.family_name;
  // const { email } = details;

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