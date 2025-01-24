import { Schema, model } from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IOrderDoc, IOrderModel } from './order.interfaces';

const orderSchema = new Schema<IOrderDoc>(
  {
  
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
      sellerId: {
      type: Schema.Types.ObjectId, 
      ref: 'User',
     
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          
        },
          imageUrl: {
      type: [String],
      required: true,
    },
          name: {
      type: String,
      trim: true,
    },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        description: {
      type: String,
    },
        profit: {
          type: Number,
        },
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
     profit: {
      type: Number,
    },
    revenue: {
        type: Number,
     },
    
    paymentMethod: {
      type: String,
      enum: ['card', 'paypal', 'bank_transfer'],
      
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
      paymentDetails: {
      transactionId: { type: String },
      amount: { type: Number }, // Stored in NGN (converted from kobo)
      paidAt: { type: Date },
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    billingAddress: {
      address: {
        type: String,
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
    collection: 'ordersItem', // Explicitly specify the collection name
  }
);

// Add plugin that converts Mongoose documents to JSON
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

const OrdersItem = model<IOrderDoc, IOrderModel>('OrdersItem', orderSchema);

export default OrdersItem;
