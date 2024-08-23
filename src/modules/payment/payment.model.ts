import { Schema, model } from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IPaymentDoc, IPaymentModel } from './payment.interfaces';

// Payment Method Schema
const paymentMethodSchema = new Schema<IPaymentDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cardNumber: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: String,
      required: true,
    },
    cardHolderName: {
      type: String,
      required: true,
    },
    billingAddress: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add plugins that convert mongoose to JSON and support pagination
paymentMethodSchema.plugin(toJSON);
paymentMethodSchema.plugin(paginate);

// Create the Payment model
const Payment = model<IPaymentDoc, IPaymentModel>('Payment', paymentMethodSchema);

export default Payment;
