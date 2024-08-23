import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';
import { AccessAndRefreshTokens } from '../token/token.interfaces';

export interface IUser {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  nin: string; // National Identification Number
  itemToSell: 'watch' | 'clothing' | 'shoes' | 'other';
  businessName?: string;
  socialMediaLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  bankAccount: {
    accountNumber: string;
    bankName: string;
  };
  role: string;
  notificationToken: string;
  isEmailVerified: boolean;
  verificationStatus: boolean;
  lastseen: Date;
  active: string;
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateUserBody = Partial<IUser>;

export type NewRegisteredUser = Omit<IUser, 'role' | 'isEmailVerified' | 'notificationToken' | 'verificationStatus' | 'dateOfBirth' | 'address' | 'nin' | 'itemToSell' | 'businessName' | 'socialMediaLinks' | 'bankAccount'>;

export type NewCreatedUser = Omit<IUser, 'isEmailVerified' | 'notificationToken' | 'verificationStatus'>;

export interface IUserWithTokens {
  user: IUserDoc;
  tokens: AccessAndRefreshTokens;
}