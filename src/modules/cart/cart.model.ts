import { Schema, model } from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { ICartDoc, ICartModel } from './cart.interfaces';

// Define schema for cart items 
const cartSchema = new Schema<ICartDoc>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product', // Links to the product model
      required: true,
    },
  
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    imageUrl: {
      type: [String],
      required: true,
    },
    size: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: null,
    },
  
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Links the cart to a specific user
      required: true,
      unique: true, // Ensures one cart per user
    },
   
    totalPrice: {
      type: Number,
      required: true,
      default: 0, // Initial total price is zero
    },
    currency: {
      type: String,
      required: true,
      default: 'USD', // Default currency
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Add plugins for toJSON and pagination
cartSchema.plugin(toJSON);
cartSchema.plugin(paginate);

// Create and export the Cart model
const Cart = model<ICartDoc, ICartModel>('Cart', cartSchema);

export default Cart;