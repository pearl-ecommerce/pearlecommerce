import { Schema, model } from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IDiscountDoc, IDiscountModel } from './discount.interfaces';

const discountSchema = new Schema<IDiscountDoc>(
  {
     name: {
      type: String,
      required: true,
      trim: true,
    },
        userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    discount: {
      type: String,
      required: true,
      trim: true,
    }
    
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
discountSchema.plugin(toJSON);
discountSchema.plugin(paginate);

const Discount = model<IDiscountDoc, IDiscountModel>('Discount', discountSchema);

export default Discount;
