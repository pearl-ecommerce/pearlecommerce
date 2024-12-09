import { Schema, model } from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IBundleDoc, IBundleModel } from './bundle.interfaces';

// Define schema for cart items 
const bundleSchema = new Schema<IBundleDoc>(
  {
    
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
       
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      
    },
    price: {
      type: Number,
      min: 0,
      
    },
    quantity: {
      type: Number,
      min: 1,
      required: true,
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
    totalPrice: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'NG',
    },
  },
  {
    timestamps: true,
  }
 
);
// cartSchema.index({ userId: 1, productId: 1 }, { unique: true });


// Add plugins for toJSON and pagination
bundleSchema.plugin(toJSON);
bundleSchema.plugin(paginate);

// Create and export the Cart model
const Bundle = model<IBundleDoc, IBundleModel>('Bundle', bundleSchema);

export default Bundle;


