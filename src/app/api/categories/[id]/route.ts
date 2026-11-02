import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import Task from "@/models/Task";
import { updateCategorySchema } from "@/lib/validations/category";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid category ID format." },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body provided." },
        { status: 400 }
      );
    }

    const validationResult = updateCategorySchema.safeParse(body);
    if (!validationResult.success) {
      const firstError =
        validationResult.error.issues[0]?.message || "Validation failed";
      return NextResponse.json(
        {
          success: false,
          message: firstError,
          errors: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const allowedUpdates = validationResult.data;
    if (Object.keys(allowedUpdates).length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid fields provided for update." },
        { status: 400 }
      );
    }

    const currentCategory = await Category.findById(id);
    if (!currentCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found." },
        { status: 404 }
      );
    }

    // Check name uniqueness if name is changing
    if (
      allowedUpdates.name &&
      allowedUpdates.name.toLowerCase() !== currentCategory.name.toLowerCase()
    ) {
      const conflict = await Category.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${allowedUpdates.name}$`, "i") },
      });
      if (conflict) {
        return NextResponse.json(
          {
            success: false,
            message: `Category name "${allowedUpdates.name}" is already in use.`,
          },
          { status: 409 }
        );
      }

      // Update tasks referencing the old category name
      await Task.updateMany(
        { category: currentCategory.name },
        { $set: { category: allowedUpdates.name } }
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    ).lean();

    const taskCount = await Task.countDocuments({
      category: updatedCategory?.name,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...updatedCategory,
          taskCount,
        },
        message: "Category updated successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PATCH /api/categories/[id]] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update category.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid category ID format." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const deletedCategory = await Category.findByIdAndDelete(id).lean();

    if (!deletedCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found." },
        { status: 404 }
      );
    }

    // Safely reassign associated tasks to "General"
    await Task.updateMany(
      { category: deletedCategory.name },
      { $set: { category: "General" } }
    );

    return NextResponse.json(
      {
        success: true,
        data: deletedCategory,
        message: "Category deleted and associated tasks moved to General.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE /api/categories/[id]] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete category.",
      },
      { status: 500 }
    );
  }
}

