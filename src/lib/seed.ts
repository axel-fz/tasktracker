import Task from "@/models/Task";

export const initialTasksData = [
  {
    title: "Update Task Title",
    description: "Description dolor sit a con- sectetur adipisicing elit.",
    status: "To Do",
    priority: "High",
    createdAt: new Date("2023-10-18T10:00:00Z"),
  },
  {
    title: "Implement MongoDB Connection",
    description: "Description dolor slur met, consectetur adipisicing elit.",
    status: "In Progress",
    priority: "Medium",
    createdAt: new Date("2023-10-18T11:15:00Z"),
  },
  {
    title: "Update Task Title",
    description: "Description dolor sit a con- setur adipisicing elit.",
    status: "In Progress",
    priority: "Medium",
    createdAt: new Date("2023-10-18T12:30:00Z"),
  },
  {
    title: "Update Task Title",
    description: "Description dolor sit amet, adipisicing elit.",
    status: "To Do",
    priority: "High",
    createdAt: new Date("2023-10-18T13:45:00Z"),
  },
  {
    title: "Update Task Title",
    description: "Description dolor met, adipisicing elit.",
    status: "In Progress",
    priority: "High",
    createdAt: new Date("2023-10-18T14:00:00Z"),
  },
  {
    title: "Update Task Title",
    description: "Description dolor sit amet, adipisicing elit.",
    status: "In Progress",
    priority: "High",
    createdAt: new Date("2023-10-18T14:30:00Z"),
  },
  {
    title: "Update Task Title",
    description: "Implement MongoDB connection adipisicing elit.",
    status: "To Do",
    priority: "Low",
    createdAt: new Date("2023-10-18T15:00:00Z"),
  },
  {
    title: "Update Task Title",
    description: "Description dolor sit amet, adipisicing elit.",
    status: "In Progress",
    priority: "Low",
    createdAt: new Date("2023-10-18T15:30:00Z"),
  },
  {
    title: "Update Task Title",
    description: "Description dolor sit amet, adipisicing elit.",
    status: "To Do",
    priority: "Low",
    createdAt: new Date("2023-10-18T16:00:00Z"),
  },
  {
    title: "Update MongoDB Schema",
    description: "Refactor task model to support strict validation and index optimization.",
    status: "Done",
    priority: "High",
    createdAt: new Date("2023-10-17T09:00:00Z"),
  },
  {
    title: "Configure App Router and Global Layout",
    description: "Set up metadata, fonts, and dark navy theme layout container.",
    status: "Done",
    priority: "Medium",
    createdAt: new Date("2023-10-17T11:20:00Z"),
  },
  {
    title: "Design System Tokens Integration",
    description: "Finalize CSS custom properties and color variables for dark navy UI.",
    status: "Done",
    priority: "Low",
    createdAt: new Date("2023-10-17T14:10:00Z"),
  },
];

export async function seedInitialTasks(): Promise<void> {
  const count = await Task.countDocuments();
  if (count === 0) {
    await Task.insertMany(initialTasksData);
  }
}

