import { Schema, model } from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IRoleDoc, IRoleModel } from './role.interfaces';

const roleSchema = new Schema<IRoleDoc>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
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
roleSchema.plugin(toJSON);
roleSchema.plugin(paginate);

const Role = model<IRoleDoc, IRoleModel>('Role', roleSchema);

export default Role;
