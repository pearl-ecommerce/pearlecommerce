import httpStatus from 'http-status';
// import mongoose from 'mongoose';
import Token from '../token/token.model';
import ApiError from '../errors/ApiError';
import tokenTypes from '../token/token.types';
import { getUserByEmail, updateUserById } from '../user/user.service';
import { IUserDoc, IUserWithTokens } from '../user/user.interfaces';
import { generateAuthTokens, verifyToken } from '../token/token.service';
import User from '../user/user.model';


/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<IUserDoc>}
 */
export const loginUserWithEmailAndPassword = async (email: string, password: string): Promise<IUserDoc> => {
  const user = await getUserByEmail(email);

  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  user.lastseen = new Date();
  //  const firstname = user.firstName;
  await user.save();
  return user;
};
// export const loginUserWithEmailAndPassword = async (
//   email: string,
//   password: string
// ): Promise<{ user: IUserDoc; firstname: string }> => {
//   const user = await getUserByEmail(email);

//   if (!user || !(await user.isPasswordMatch(password))) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
//   }

//   user.lastseen = new Date();
//   const firstname = user.firstName;
//   await user.save();

//   // Return both user and firstname in an object
//   return { user, firstname };
// };

// export const loginAdminWithEmailAndPassword = async (email: string, password: string): Promise<IUserDoc> => {
//   const admin = await getUserByEmail(email);
//   if (!admin || !(await admin.isPasswordMatch(password))) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
//   }
//   if (admin.role !== 'admin') {
//     throw new ApiError(httpStatus.FORBIDDEN, 'Only admins can log in');
//   }
//     if (!admin.active) {
//     throw new ApiError(httpStatus.FORBIDDEN, 'Your account has been deactivated');
//   }
//   admin.lastseen = new Date();
//   await admin.save();
//   return admin;
// };

export const loginAdminWithEmailAndPassword = async (email: string, password: string): Promise<IUserDoc> => {
  const admin = await getUserByEmail(email);
  if (!admin || !(await admin.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  if (admin.role !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Only admins can log in');
  }
  if (!admin.active) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Your account has been deactivated');
  }

  // Check if the admin password is a default one
  if (
    password === 'Admin123?' ||
    password === 'Superadmin123?' ||
    password === 'Viewer123?'
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Please change your password');
  }

  admin.lastseen = new Date();
  await admin.save();
  return admin;
};


/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
export const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<IUserWithTokens>}
 */
export const refreshAuth = async (refreshToken: string): Promise<IUserWithTokens> => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);
      const user = await User.findById(refreshTokenDoc.user);

    // const user = await getUserById(new mongoose.Types.ObjectId(refreshTokenDoc.user));
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    const tokens = await generateAuthTokens(user);
    return { user, tokens };
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const resetPassword = async (resetPasswordToken: any, newPassword: string): Promise<void> => {
  try {
    const resetPasswordTokenDoc = await verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
          const user = await User.findById(resetPasswordTokenDoc.user);

    // const user = await getUserById(new mongoose.Types.ObjectId(resetPasswordTokenDoc.user));
    if (!user) {
      throw new Error();
    }
    await updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};
export const changePassword = async (email: string, newPassword: string): Promise<string> => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    await updateUserById(user.id, { password: newPassword });

    return "Password changed successfully";
  } catch (error) {
    throw new Error(`Error changing password}`);
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise<IUserDoc | null>}
 */
export const verifyEmail = async (verifyEmailToken: any): Promise<IUserDoc | null> => {
  try {
    const verifyEmailTokenDoc = await verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
              const user = await User.findById(verifyEmailTokenDoc.user);

    // const user = await getUserById(new mongoose.Types.ObjectId(verifyEmailTokenDoc.user));
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    const updatedUser = await updateUserById(user.id, { isEmailVerified: true });
    return updatedUser;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};
