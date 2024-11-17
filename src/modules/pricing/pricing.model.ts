import { Schema, model } from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IPricingDoc, IPricingModel } from './pricing.interfaces';

const pricingSchema = new Schema<IPricingDoc>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
pricingSchema.plugin(toJSON);
pricingSchema.plugin(paginate);

const Pricing = model<IPricingDoc, IPricingModel>('Pricing', pricingSchema);

export default Pricing;
