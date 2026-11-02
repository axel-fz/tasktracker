import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import Task from "@/models/Task";
import { createCategorySchema } from "@/lib/validations/category";

export async function GET() {
  try {
    await connectToDatabase();

    const [categories, counts] = await Promise.all([
      Category.find().sort({ createdAt: -1 }).lean(),
      Task.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]),
    ]);

    const countMap: Record<string, number> = {};
    for (const item of counts) {
      if (item._id) {
        countMap[item._id] = item.count;
      }
    }

    const categoriesWithCount = categories.map((cat) => ({
      ...cat,
      taskCount: countMap[cat.name] || 0,
    }));

    return NextResponse.json(
      {
        success: true,
        data: categoriesWithCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/categories] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve categories.",
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

    const validationResult = createCategorySchema.safeParse(body);
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

    const { name, color, icon, description } = validationResult.data;

    // Check if duplicate category name exists
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: `Category "${name}" already exists.`,
        },
        { status: 409 }
      );
    }

    const newCategory = await Category.create({
      name,
      color,
      icon,
      description,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...newCategory.toObject(),
          taskCount: 0,
        },
        message: "Category created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/categories] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create category.",
      },
      { status: 500 }
    );
  }
}

