import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: "To Do" | "In Progress" | "Done";
  priority: "Low" | "Medium" | "High";
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [120, "Title must be at most 120 characters"],
    },
    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: [500, "Description must be at most 500 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: ["To Do", "In Progress", "Done"],
        message: "{VALUE} is not a valid status",
      },
      default: "To Do",
      required: true,
    },
    priority: {
      type: String,
      enum: {
        values: ["Low", "Medium", "High"],
        message: "{VALUE} is not a valid priority",
      },
      default: "Medium",
      required: true,
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose recompilation in Next.js HMR
const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);

export default Task;
