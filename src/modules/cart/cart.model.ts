import { Schema, model } from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { ICartDoc, ICartModel } from './cart.interfaces';

// Define schema for cart items 
const cartSchema = new Schema<ICartDoc>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product', 
      required: true,
    },
  
    price: {
      type: Number,
     
      min: 0,
    },
    quantity: {
      type: Number,
     
      min: 1,
    },
    imageUrl: {
      type: [String],
      
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
      ref: 'User', 
    
    },
   
    totalPrice: {
      type: Number,
      
      default: 0, // Initial total price is zero
    },
    currency: {
      type: String,
     
      default: 'NG', // Default currency
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);
cartSchema.index({ userId: 1, productId: 1 }, { unique: true });


// Add plugins for toJSON and pagination
cartSchema.plugin(toJSON);
cartSchema.plugin(paginate);

// Create and export the Cart model
const Cart = model<ICartDoc, ICartModel>('Cart', cartSchema);

export default Cart;


