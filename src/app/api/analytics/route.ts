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

    // Status breakdown (Spectral palette mapping)
    const statusBreakdown = [
      {
        status: "Done",
        count: doneTasks,
        percentage: totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0,
        color: "#10b981", // Emerald
      },
      {
        status: "In Progress",
        count: inProgressTasks,
        percentage:
          totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0,
        color: "#fd7249", // Spectral Tangerine
      },
      {
        status: "To Do",
        count: todoTasks,
        percentage: totalTasks > 0 ? Math.round((todoTasks / totalTasks) * 100) : 0,
        color: "#b23255", // Spectral Crimson Rose
      },
    ];

    // Priority breakdown (Spectral palette mapping)
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
        color: "#ff5249", // Spectral Sunset Coral
      },
      {
        priority: "Medium",
        count: mediumCount,
        percentage:
          totalTasks > 0 ? Math.round((mediumCount / totalTasks) * 100) : 0,
        color: "#fe9346", // Spectral Golden Amber
      },
      {
        priority: "Low",
        count: lowCount,
        percentage: totalTasks > 0 ? Math.round((lowCount / totalTasks) * 100) : 0,
        color: "#9f8193", // Spectral Soft Plum
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

