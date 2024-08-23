import { Schema, model } from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IOrderDoc, IOrderModel } from './order.interfaces';

const orderSchema = new Schema<IOrderDoc>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    
    paymentMethod: {
      type: String,
      enum: ['card', 'paypal', 'bank_transfer'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    billingAddress: {
      address: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    orderStatus: {
      type: String,
      enum: ['processing', 'shipped', 'delivered', 'canceled'],
      default: 'processing',
    },
    deliveryDate: {
      type: Date,
    },
    trackingNumber: {
      type: String,
    },
     reference: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to JSON
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

const Order = model<IOrderDoc, IOrderModel>('Order', orderSchema);

export default Order;
