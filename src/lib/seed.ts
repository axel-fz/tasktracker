import Task from "@/models/Task";
import Category from "@/models/Category";

export const initialCategoriesData = [
  {
    name: "Engineering",
    color: "#3b82f6",
    icon: "Code",
    description: "Software engineering, APIs, database schema and backend tasks.",
  },
  {
    name: "Design",
    color: "#a855f7",
    icon: "Palette",
    description: "UI/UX prototypes, design system tokens, and styling specifications.",
  },
  {
    name: "Product",
    color: "#10b981",
    icon: "Layers",
    description: "Product roadmap, feature planning, and user feedback tasks.",
  },
  {
    name: "Operations",
    color: "#f59e0b",
    icon: "Briefcase",
    description: "DevOps, infrastructure, deployment pipelines, and analytics.",
  },
];

export const initialTasksData = [
  {
    title: "Update Task Title",
    description: "Description dolor sit a con- sectetur adipisicing elit.",
    status: "To Do",
    priority: "High",
    category: "Engineering",
    createdAt: new Date("2023-10-18T10:00:00Z"),
  },
  {
    title: "Implement MongoDB Connection",
    description: "Description dolor slur met, consectetur adipisicing elit.",
    status: "In Progress",
    priority: "Medium",
    category: "Engineering",
    createdAt: new Date("2023-10-18T11:15:00Z"),
  },
  {
    title: "Update Task Title",
    description: "Description dolor sit a con- setur adipisicing elit.",
    status: "In Progress",
    priority: "Medium",
    category: "Design",
    createdAt: new Date("2023-10-18T12:30:00Z"),
  },
  {
    title: "Update Task Title",
    description: "Description dolor sit amet, adipisicing elit.",
    status: "To Do",
    priority: "High",
    category: "Product",
    createdAt: new Date("2023-10-18T13:45:00Z"),
  },
  {
    title: "Update Task Title",
    description: "Description dolor met, adipisicing elit.",
    status: "In Progress",
    priority: "High",
    category: "Operations",
    createdAt: new Date("2023-10-18T14:00:00Z"),
  },
  {
    title: "Update Task Title",
    description: "Description dolor sit amet, adipisicing elit.",
    status: "In Progress",
    priority: "High",
    category: "Engineering",
    createdAt: new Date("2023-10-18T14:30:00Z"),
  },
  {
    title: "Update Task Title",
    description: "Implement MongoDB connection adipisicing elit.",
    status: "To Do",
    priority: "Low",
    category: "Engineering",
    createdAt: new Date("2023-10-18T15:00:00Z"),
  },
  {
    title: "Update Task Title",
    description: "Description dolor sit amet, adipisicing elit.",
    status: "In Progress",
    priority: "Low",
    category: "Design",
    createdAt: new Date("2023-10-18T15:30:00Z"),
  },
  {
    title: "Update Task Title",
    description: "Description dolor sit amet, adipisicing elit.",
    status: "To Do",
    priority: "Low",
    category: "Product",
    createdAt: new Date("2023-10-18T16:00:00Z"),
  },
  {
    title: "Update MongoDB Schema",
    description: "Refactor task model to support strict validation and index optimization.",
    status: "Done",
    priority: "High",
    category: "Engineering",
    createdAt: new Date("2023-10-17T09:00:00Z"),
  },
  {
    title: "Configure App Router and Global Layout",
    description: "Set up metadata, fonts, and dark navy theme layout container.",
    status: "Done",
    priority: "Medium",
    category: "Engineering",
    createdAt: new Date("2023-10-17T11:20:00Z"),
  },
  {
    title: "Design System Tokens Integration",
    description: "Finalize CSS custom properties and color variables for dark navy UI.",
    status: "Done",
    priority: "Low",
    category: "Design",
    createdAt: new Date("2023-10-17T14:10:00Z"),
  },
];

export async function seedInitialTasks(): Promise<void> {
  const categoryCount = await Category.countDocuments();
  if (categoryCount === 0) {
    await Category.insertMany(initialCategoriesData);
  }

  const taskCount = await Task.countDocuments();
  if (taskCount === 0) {
    await Task.insertMany(initialTasksData);
  }
}
