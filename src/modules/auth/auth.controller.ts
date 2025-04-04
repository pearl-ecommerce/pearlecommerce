import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { tokenService } from '../token';
import { userService } from '../user';
import * as authService from './auth.service';
import { emailService } from '../email';
import { sendSuccessResponse, sendErrorResponse } from '../utils/response';




export const register = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.registerUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  // Define a response object with status and message
  const response = {
    status: true, 
    message: 'User registered successfully',
    data: { user, tokens } // Include user and tokens as data
  };
  await emailService.sendSuccessfulRegistration(req.body.email, tokens.access.token, req.body.firstName);
  await emailService.sendAccountCreated(req.body.email, req.body.firstName);

  res.status(httpStatus.CREATED).json(response);
});




export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  
  const message = "login successful";
   await emailService.sendLoginEmail(req.body.email);
  res.status(200).send({user, tokens,message });
});

export const adminlogin = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const admin = await authService.loginAdminWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(admin);
  const message = "admin-login successful";
   await emailService.sendLoginEmail(req.body.email);
  res.status(200).send({admin, tokens,message });
});


export const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

export const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const userWithTokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...userWithTokens });
});
 
export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
   console.log('Request Body:', req.body); // Log the request body
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

export const forgotPasswordAdmin = catchAsync(async (req: Request, res: Response) => {
   console.log('Request Body:', req.body); // Log the request body
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmailAdmin(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.resetPassword(req.query['token'], req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

export const changePassword = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    await authService.changePassword(email, password);

    res.status(httpStatus.OK).json({ message: 'Admin password changed successfully.' });
});


export const sendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken, req.user.firstName);
  res.status(httpStatus.NO_CONTENT).send();
});

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  await authService.verifyEmail(req.query['token']);
  res.status(httpStatus.NO_CONTENT).send();
});



export const oauthSignin = catchAsync(async (req: Request, res: Response) => {
  try {
    // await userService.oauthSignup(req.user)
    const user = await userService.oauthSignup(req.body)
    const tokens = await tokenService.generateAuthTokens(user);
    const data = { user, tokens }


    sendSuccessResponse(res, httpStatus.OK, "user successfully Signed up", data);
  } catch (error: any) {
    sendErrorResponse(res, error.statusCode, error.message);
  }
});

export const verifyUserNIN = catchAsync(async (req: Request, res: Response) => {
  try {
    const { nin } = req.body;

    if (!nin) {
      return sendErrorResponse(res, httpStatus.BAD_REQUEST, "NIN is required");
    }

    const verificationData = await authService.verifyNIN(nin);
    return sendSuccessResponse(res, httpStatus.OK, "NIN verified successfully", verificationData);
  } catch (error: any) {
    return sendErrorResponse(res, error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
});