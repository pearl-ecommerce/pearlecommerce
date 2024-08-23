import mongoose, { Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { roles } from '../../config/roles';
import { IUserDoc, IUserModel } from './user.interfaces';

const userSchema = new Schema<IUserDoc>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    dateOfBirth: {
      type: Date,
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },
    nin: {
      type: String,
    },
    itemToSell: {
      type: String,
      enum: ['watch', 'clothing', 'shoes', 'other'], // Add more categories as needed
    },
    businessName: {
      type: String,
      sparse: true, // This allows null values and only enforces uniqueness on non-null values
    },
    socialMediaLinks: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
    },
    bankAccount: {
      accountNumber: String,
      bankName: String,
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: Boolean,
      default: false,
    },
     lastseen: {
        type: Date,
        default: Date.now, // Sets the default to the current date and time
    },
      active: {
        type: String,
        default: 'yes', // Sets the default to the current date and time
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.static('isEmailTaken', async function (email: string, excludeUserId: mongoose.ObjectId): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
});

/**
 * Check if NIN is taken
 * @param {string} nin - The user's NIN
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.static('isNINTaken', async function (nin: string, excludeUserId: mongoose.ObjectId): Promise<boolean> {
  const user = await this.findOne({ nin, _id: { $ne: excludeUserId } });
  return !!user;
});

/**
 * Check if business name is taken
 * @param {string} businessName - The user's business name
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.static('isBusinessNameTaken', async function (businessName: string, excludeUserId: mongoose.ObjectId): Promise<boolean> {
  const user = await this.findOne({ businessName, _id: { $ne: excludeUserId } });
  return !!user;
});

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.method('isPasswordMatch', async function (password: string): Promise<boolean> {
  const user = this;
  return bcrypt.compare(password, user.password);
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = model<IUserDoc, IUserModel>('User', userSchema);

export default User;