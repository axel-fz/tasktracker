"use client";

import React from "react";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Folder,
  ArrowRight,
  Plus,
  TrendingUp,
  LayoutDashboard,
  CheckSquare,
  Sparkles,
  Database,
  ArrowUpRight,
} from "lucide-react";
import {
  ITaskResponse,
  TaskStatus,
  TaskPriority,
} from "@/lib/validations/task";
import { ICategoryResponse } from "@/lib/validations/category";
import TaskRow from "./TaskRow";

interface DashboardOverviewProps {
  tasks: ITaskResponse[];
  categories: ICategoryResponse[];
  counts: {
    all: number;
    todo: number;
    inProgress: number;
    done: number;
  };
  isLoading: boolean;
  onNavigate: (view: string) => void;
  onOpenNewTask: () => void;
  onQuickToggleStatus: (task: ITaskResponse) => Promise<void>;
  onEditTask: (task: ITaskResponse) => void;
  onDeleteTask: (task: ITaskResponse) => void;
  onUpdateStatus?: (task: ITaskResponse, newStatus: TaskStatus) => Promise<void>;
  onUpdatePriority?: (task: ITaskResponse, newPriority: TaskPriority) => Promise<void>;
  onSelectCategoryTasks: (categoryName: string) => void;
}

export default function DashboardOverview({
  tasks,
  categories,
  counts,
  isLoading,
  onNavigate,
  onOpenNewTask,
  onQuickToggleStatus,
  onEditTask,
  onDeleteTask,
  onUpdateStatus,
  onUpdatePriority,
  onSelectCategoryTasks,
}: DashboardOverviewProps) {
  // Completion calculation
  const completionRate =
    counts.all > 0 ? Math.round((counts.done / counts.all) * 100) : 0;

  // Filter urgent / priority tasks for summary
  const highPriorityTasks = tasks.filter(
    (t) => t.priority === "High" && t.status !== "Done"
  );
  
  // Recent 4 tasks to show in the summary list
  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Welcome & Quick Action Hub Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1e2f4e]/80">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f8fafc]">
              Workspace Overview
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#7f98b3] mt-1 max-w-xl">
            Live summary of your workload, project categories, and completion velocity
          </p>
        </div>

        {/* Quick Hub Navigation & Action Shortcuts */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onNavigate("Analytics")}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-lg bg-[#16233d] hover:bg-[#1e2f4e] border border-[#23385d] text-[#8cb4e2] hover:text-white transition-all cursor-pointer shadow-xs"
          >
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => onNavigate("Categories")}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-lg bg-[#16233d] hover:bg-[#1e2f4e] border border-[#23385d] text-[#8cb4e2] hover:text-white transition-all cursor-pointer shadow-xs"
          >
            <Folder className="w-3.5 h-3.5 text-indigo-400" />
            <span>Categories</span>
          </button>

          <button
            onClick={onOpenNewTask}
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 text-xs font-semibold rounded-lg bg-[#1d4ed8] hover:bg-[#2563eb] text-white shadow-md hover:shadow-blue-600/25 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* 2. Top Executive KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks Card */}
        <div
          onClick={() => onNavigate("Tasks")}
          className="group cursor-pointer rounded-xl border border-[#1e2f4e]/80 bg-[#131e33] hover:border-blue-500/60 p-5 transition-all duration-150 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7f98b3] group-hover:text-blue-400 transition-colors">
              Total Workload
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-[#f8fafc] tracking-tight">
              {counts.all}
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px] text-[#7f98b3]">
              <span>{counts.todo + counts.inProgress} active remaining</span>
              <span className="text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                View <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Completion Rate Card */}
        <div
          onClick={() => onNavigate("Analytics")}
          className="group cursor-pointer rounded-xl border border-[#1e2f4e]/80 bg-[#131e33] hover:border-emerald-500/60 p-5 transition-all duration-150 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7f98b3] group-hover:text-emerald-400 transition-colors">
              Completion Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-[#f8fafc] tracking-tight">
              {completionRate}%
            </div>
            <div className="w-full bg-[#0d1627] rounded-full h-1.5 mt-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* In Progress Card */}
        <div
          onClick={() => onNavigate("Tasks")}
          className="group cursor-pointer rounded-xl border border-[#1e2f4e]/80 bg-[#131e33] hover:border-sky-500/60 p-5 transition-all duration-150 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7f98b3] group-hover:text-sky-400 transition-colors">
              In Progress
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-[#f8fafc] tracking-tight">
              {counts.inProgress}
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px] text-[#7f98b3]">
              <span>Active in current sprint</span>
              <span className="text-sky-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Tasks <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

        {/* High Priority Attention Card */}
        <div
          onClick={() => onNavigate("Tasks")}
          className="group cursor-pointer rounded-xl border border-[#1e2f4e]/80 bg-[#131e33] hover:border-red-500/60 p-5 transition-all duration-150 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7f98b3] group-hover:text-red-400 transition-colors">
              High Priority Needs
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-[#f8fafc] tracking-tight">
              {highPriorityTasks.length}
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px] text-red-400 font-medium">
              <span>Urgent action required</span>
              <span className="group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Review <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Body: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Recent & High Priority Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1e2f4e]/60">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#f8fafc] flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-blue-400" />
                Recent & Priority Tasks
              </h2>
              <p className="text-xs text-[#7f98b3]">
                Quick actions on latest active tasks
              </p>
            </div>

            <button
              onClick={() => onNavigate("Tasks")}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#60a5fa] hover:text-[#93c5fd] transition-colors cursor-pointer"
            >
              <span>View All Tasks ({counts.all})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Task list preview */}
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 rounded-xl bg-[#131e33] border border-[#1e2f4e]/60 animate-pulse"
                />
              ))}
            </div>
          ) : recentTasks.length === 0 ? (
            <div className="p-8 text-center rounded-xl border border-[#1e2f4e]/60 bg-[#131e33]/60">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-semibold text-[#f8fafc]">
                All caught up! No tasks found.
              </p>
              <p className="text-xs text-[#7f98b3] mt-1 mb-4">
                Create a task to get started tracking your work.
              </p>
              <button
                onClick={onOpenNewTask}
                className="inline-flex items-center gap-2 bg-[#1d4ed8] hover:bg-[#2563eb] text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Task</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentTasks.map((task) => (
                <TaskRow
                  key={task._id}
                  task={task}
                  onQuickToggleStatus={onQuickToggleStatus}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onUpdateStatus={onUpdateStatus}
                  onUpdatePriority={onUpdatePriority}
                />
              ))}

              <div className="pt-2 text-center">
                <button
                  onClick={() => onNavigate("Tasks")}
                  className="w-full py-2.5 rounded-lg border border-[#1e2f4e] hover:border-blue-500/50 bg-[#131e33] hover:bg-[#16233d] text-xs font-semibold text-[#8cb4e2] hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Go to Full Tasks View with Custom Filters</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Categories Snapshot & Progress Breakdown */}
        <div className="space-y-6">
          {/* Card: Category Domains */}
          <div className="rounded-xl border border-[#1e2f4e]/80 bg-[#131e33] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-[#f8fafc]">
                  Project Categories
                </h3>
              </div>
              <button
                onClick={() => onNavigate("Categories")}
                className="text-xs font-semibold text-[#60a5fa] hover:text-[#93c5fd] transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Manage</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {categories.length === 0 ? (
              <p className="text-xs text-[#7f98b3] py-2">
                No categories configured yet.
              </p>
            ) : (
              <div className="space-y-2.5">
                {categories.slice(0, 5).map((category) => (
                  <div
                    key={category._id}
                    onClick={() => onSelectCategoryTasks(category.name)}
                    className="group cursor-pointer p-2.5 rounded-lg bg-[#0d1627] hover:bg-[#14233c] border border-[#1e2f4e] hover:border-blue-500/40 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: category.color || "#3b82f6" }}
                      />
                      <span className="text-xs font-medium text-[#cad5e2] group-hover:text-white truncate">
                        {category.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#111c30] text-[#7f98b3] border border-[#1e2f4e]">
                        {category.taskCount ?? 0}
                      </span>
                      <ArrowRight className="w-3 h-3 text-[#7f98b3] group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card: Status Distribution Snapshot */}
          <div className="rounded-xl border border-[#1e2f4e]/80 bg-[#131e33] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-[#f8fafc]">
                  Status Breakdown
                </h3>
              </div>
              <button
                onClick={() => onNavigate("Analytics")}
                className="text-xs font-semibold text-[#60a5fa] hover:text-[#93c5fd] transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Analytics</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Multi-segment stacked progress bar */}
            <div className="w-full h-3 rounded-full bg-[#0d1627] flex overflow-hidden mb-4">
              <div
                style={{
                  width: `${counts.all > 0 ? (counts.done / counts.all) * 100 : 0}%`,
                }}
                className="bg-[#10b981] h-full transition-all duration-300"
                title={`Done: ${counts.done}`}
              />
              <div
                style={{
                  width: `${counts.all > 0 ? (counts.inProgress / counts.all) * 100 : 0}%`,
                }}
                className="bg-[#fd7249] h-full transition-all duration-300"
                title={`In Progress: ${counts.inProgress}`}
              />
              <div
                style={{
                  width: `${counts.all > 0 ? (counts.todo / counts.all) * 100 : 0}%`,
                }}
                className="bg-[#b23255] h-full transition-all duration-300"
                title={`To Do: ${counts.todo}`}
              />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                  <span className="text-[#cad5e2]">Done</span>
                </div>
                <span className="font-mono text-[#f8fafc] font-semibold">
                  {counts.done} ({counts.all > 0 ? Math.round((counts.done / counts.all) * 100) : 0}%)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#fd7249]" />
                  <span className="text-[#cad5e2]">In Progress</span>
                </div>
                <span className="font-mono text-[#f8fafc] font-semibold">
                  {counts.inProgress} ({counts.all > 0 ? Math.round((counts.inProgress / counts.all) * 100) : 0}%)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#b23255]" />
                  <span className="text-[#cad5e2]">To Do</span>
                </div>
                <span className="font-mono text-[#f8fafc] font-semibold">
                  {counts.todo} ({counts.all > 0 ? Math.round((counts.todo / counts.all) * 100) : 0}%)
                </span>
              </div>
            </div>
          </div>

          {/* Quick System & Atlas Status Pill */}
          <div className="p-3.5 rounded-xl border border-[#1e2f4e]/60 bg-[#131e33] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span className="text-[#7f98b3]">Atlas Cloud DB</span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

