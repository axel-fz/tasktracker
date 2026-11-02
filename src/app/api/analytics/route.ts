import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Task from "@/models/Task";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectToDatabase();

    const [
      totalTasks,
      todoTasks,
      inProgressTasks,
      doneTasks,
      highPriorityPending,
      categoryStats,
      categories,
      highPriorityTasks,
    ] = await Promise.all([
      Task.countDocuments(),
      Task.countDocuments({ status: "To Do" }),
      Task.countDocuments({ status: "In Progress" }),
      Task.countDocuments({ status: "Done" }),
      Task.countDocuments({
        priority: "High",
        status: { $in: ["To Do", "In Progress"] },
      }),
      Task.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Category.find().lean(),
      Task.find({
        priority: "High",
        status: { $in: ["To Do", "In Progress"] },
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const completionRate =
      totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    // Status breakdown
    const statusBreakdown = [
      {
        status: "Done",
        count: doneTasks,
        percentage: totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0,
        color: "#10b981", // emerald
      },
      {
        status: "In Progress",
        count: inProgressTasks,
        percentage:
          totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0,
        color: "#3b82f6", // blue
      },
      {
        status: "To Do",
        count: todoTasks,
        percentage: totalTasks > 0 ? Math.round((todoTasks / totalTasks) * 100) : 0,
        color: "#8cb4e2", // slate blue
      },
    ];

    // Priority breakdown
    const [highCount, mediumCount, lowCount] = await Promise.all([
      Task.countDocuments({ priority: "High" }),
      Task.countDocuments({ priority: "Medium" }),
      Task.countDocuments({ priority: "Low" }),
    ]);

    const priorityBreakdown = [
      {
        priority: "High",
        count: highCount,
        percentage: totalTasks > 0 ? Math.round((highCount / totalTasks) * 100) : 0,
        color: "#f87171", // coral red
      },
      {
        priority: "Medium",
        count: mediumCount,
        percentage:
          totalTasks > 0 ? Math.round((mediumCount / totalTasks) * 100) : 0,
        color: "#38bdf8", // sky blue
      },
      {
        priority: "Low",
        count: lowCount,
        percentage: totalTasks > 0 ? Math.round((lowCount / totalTasks) * 100) : 0,
        color: "#94a3b8", // cool gray
      },
    ];

    // Category breakdown with colors
    const categoryColorMap = Object.fromEntries(
      categories.map((c) => [c.name, c.color])
    );

    const categoryBreakdown = categoryStats.map((item) => ({
      name: item._id || "Unassigned",
      count: item.count,
      percentage:
        totalTasks > 0 ? Math.round((item.count / totalTasks) * 100) : 0,
      color: categoryColorMap[item._id] || "#64748b",
    }));

    return NextResponse.json(
      {
        success: true,
        data: {
          metrics: {
            totalTasks,
            todoTasks,
            inProgressTasks,
            doneTasks,
            completionRate,
            highPriorityPending,
          },
          statusBreakdown,
          priorityBreakdown,
          categoryBreakdown,
          highPriorityTasks,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/analytics] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate analytics.",
      },
      { status: 500 }
    );
  }
}

