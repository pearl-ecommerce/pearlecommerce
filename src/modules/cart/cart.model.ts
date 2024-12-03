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
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
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
cartSchema.index({ userId: 1, productId: 1 }, { unique: true });


// Add plugins for toJSON and pagination
cartSchema.plugin(toJSON);
cartSchema.plugin(paginate);

// Create and export the Cart model
const Cart = model<ICartDoc, ICartModel>('Cart', cartSchema);

export default Cart;


