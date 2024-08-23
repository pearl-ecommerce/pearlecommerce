import { Schema, model } from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { ICategoryDoc, ICategoryModel } from './category.interfaces';

// Sub-Sub-Category Schema
const subSubCategorySchema = new Schema({
  name: {
    type: String,
     required: false,
  },
});

// Sub-Category Schema
const subCategorySchema = new Schema({
  name: {
    type: String,
     required: false,
  },
  subSubCategories: [subSubCategorySchema], // Array of Sub-Sub-Categories
});

// Main Category Schema
const categorySchema = new Schema<ICategoryDoc>(
  {
    name: {
      type: String,
      required: false,
      
    },
    description: {
      type: String,
    
    },
    subCategories: [subCategorySchema], // Array of Sub-Categories
  },
  {
    timestamps: true,
  }
);

// Add plugin that converts mongoose to JSON
categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

const Category = model<ICategoryDoc, ICategoryModel>('Category', categorySchema);

export default Category;
