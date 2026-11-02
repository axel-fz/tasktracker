import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(50, "Category name must be at most 50 characters"),
  color: z
    .string()
    .trim()
    .default("#3b82f6"),
  icon: z
    .string()
    .trim()
    .default("Folder"),
  description: z
    .string()
    .trim()
    .max(200, "Description must be at most 200 characters")
    .optional()
    .default(""),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name cannot be empty")
    .max(50, "Category name must be at most 50 characters")
    .optional(),
  color: z.string().trim().optional(),
  icon: z.string().trim().optional(),
  description: z
    .string()
    .trim()
    .max(200, "Description must be at most 200 characters")
    .optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export interface ICategoryResponse {
  _id: string;
  name: string;
  color: string;
  icon?: string;
  description?: string;
  taskCount?: number;
  createdAt: string;
  updatedAt: string;
}

