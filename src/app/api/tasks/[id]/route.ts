import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Task from "@/models/Task";
import { updateTaskSchema } from "@/lib/validations/task";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid task ID format." },
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

    const validationResult = updateTaskSchema.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || "Validation failed";
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

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedTask) {
      return NextResponse.json(
        { success: false, message: "Task not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedTask,
        message: "Task updated successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PATCH /api/tasks/[id]] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update task.",
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
        { success: false, message: "Invalid task ID format." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const deletedTask = await Task.findByIdAndDelete(id).lean();

    if (!deletedTask) {
      return NextResponse.json(
        { success: false, message: "Task not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: deletedTask,
        message: "Task deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE /api/tasks/[id]] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete task.",
      },
      { status: 500 }
    );
  }
}

