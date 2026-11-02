import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  color: string;
  icon?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [50, "Category name must be at most 50 characters"],
      unique: true,
    },
    color: {
      type: String,
      default: "#3b82f6",
      trim: true,
    },
    icon: {
      type: String,
      default: "Folder",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: [200, "Description must be at most 200 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation during HMR
const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export default Category;

