import React from "react";
import { ClipboardList, Plus, SearchX } from "lucide-react";

interface EmptyStateProps {
  isSearchActive?: boolean;
  filterTab?: string;
  onClearFilters?: () => void;
  onOpenNewTask?: () => void;
}

export default function EmptyState({
  isSearchActive,
  filterTab = "All Tasks",
  onClearFilters,
  onOpenNewTask,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-[#1e2f4e]/80 bg-[#111c30]/80 p-12 text-center flex flex-col items-center justify-center my-8">
      <div className="w-14 h-14 rounded-2xl bg-[#16233d] border border-[#233555] flex items-center justify-center text-[#60a5fa] mb-4 shadow-lg shadow-blue-950/20">
        {isSearchActive ? (
          <SearchX className="w-7 h-7 text-[#7f98b3]" />
        ) : (
          <ClipboardList className="w-7 h-7 text-[#60a5fa]" />
        )}
      </div>

      <h3 className="text-base font-bold text-[#f8fafc] tracking-tight">
        {isSearchActive
          ? "No matching tasks found"
          : filterTab === "All Tasks"
          ? "No tasks yet"
          : `No tasks in "${filterTab}"`}
      </h3>

      <p className="text-xs text-[#7f98b3] max-w-sm mt-1 mb-6 leading-relaxed">
        {isSearchActive
          ? "Try adjusting your search query or clear the active filter to see more tasks."
          : filterTab === "All Tasks"
          ? "Get started by creating your first task to track your progress and productivity."
          : `There are currently no tasks marked as "${filterTab}". Add a new task or move an existing task here.`}
      </p>

      <div className="flex items-center gap-3">
        {isSearchActive && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-xs font-semibold text-[#8eb0d4] hover:text-white bg-[#15233c] hover:bg-[#1b2b48] border border-[#25395c] rounded-lg transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        )}
        {onOpenNewTask && (
          <button
            onClick={onOpenNewTask}
            className="flex items-center gap-2 bg-[#1d4ed8] hover:bg-[#2563eb] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-blue-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
        )}
      </div>
    </div>
  );
}

