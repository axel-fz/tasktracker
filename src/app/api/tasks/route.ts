import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Task from "@/models/Task";
import { createTaskSchema, TASK_STATUSES, TaskStatus } from "@/lib/validations/task";

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = request.nextUrl;
    const statusParam = searchParams.get("status");
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");

    const filter: Record<string, unknown> = {};

    if (
      statusParam &&
      statusParam !== "All" &&
      TASK_STATUSES.includes(statusParam as TaskStatus)
    ) {
      filter.status = statusParam;
    }

    if (categoryParam && categoryParam !== "All") {
      filter.category = categoryParam;
    }

    if (searchParam && typeof searchParam === "string" && searchParam.trim()) {
      const sanitized = escapeRegex(searchParam.trim());
      filter.$or = [
        { title: { $regex: sanitized, $options: "i" } },
        { description: { $regex: sanitized, $options: "i" } },
      ];
    }

    const [tasks, totalCount, todoCount, inProgressCount, doneCount] =
      await Promise.all([
        Task.find(filter).sort({ createdAt: -1 }).lean(),
        Task.countDocuments({}),
        Task.countDocuments({ status: "To Do" }),
        Task.countDocuments({ status: "In Progress" }),
        Task.countDocuments({ status: "Done" }),
      ]);

    return NextResponse.json(
      {
        success: true,
        data: tasks,
        counts: {
          all: totalCount,
          todo: todoCount,
          inProgress: inProgressCount,
          done: doneCount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/tasks] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve tasks. Please try again later.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body provided." },
        { status: 400 }
      );
    }

    const validationResult = createTaskSchema.safeParse(body);
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

    const { title, description, status, priority, category } = validationResult.data;
    const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      category: category || "General",
    });

    return NextResponse.json(
      {
        success: true,
        data: newTask,
        message: "Task created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/tasks] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create task.",
      },
      { status: 500 }
    );
  }
}

