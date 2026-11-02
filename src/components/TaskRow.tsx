"use client";

import React, { useState } from "react";
import { Check, Pencil, Trash2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { ITaskResponse, TaskStatus, TaskPriority } from "@/lib/validations/task";

interface TaskRowProps {
  task: ITaskResponse;
  isSelected?: boolean;
  onSelect?: () => void;
  onQuickToggleStatus: (task: ITaskResponse) => Promise<void>;
  onEdit: (task: ITaskResponse) => void;
  onDelete: (task: ITaskResponse) => void;
  onUpdateStatus?: (task: ITaskResponse, newStatus: TaskStatus) => Promise<void>;
  onUpdatePriority?: (task: ITaskResponse, newPriority: TaskPriority) => Promise<void>;
}

export default function TaskRow({
  task,
  isSelected,
  onSelect,
  onQuickToggleStatus,
  onEdit,
  onDelete,
  onUpdateStatus,
  onUpdatePriority,
}: TaskRowProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);

  const isCompleted = task.status === "Done";

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isToggling) return;
    try {
      setIsToggling(true);
      await onQuickToggleStatus(task);
    } finally {
      setIsToggling(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "-";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getStatusBadgeStyle = (status: TaskStatus) => {
    switch (status) {
      case "Done":
        return "bg-[#11332a] text-[#34d399] border-[#059669]/40";
      case "In Progress":
        return "bg-[#153154] text-[#60a5fa] border-[#2563eb]/40";
      case "To Do":
      default:
        return "bg-[#19273f] text-[#8cb4e2] border-[#263c62]";
    }
  };

  const getPriorityBadgeStyle = (priority: TaskPriority) => {
    switch (priority) {
      case "High":
        return "bg-[#361928] text-[#f87171] border-[#ef4444]/40";
      case "Medium":
        return "bg-[#143252] text-[#38bdf8] border-[#0284c7]/40";
      case "Low":
      default:
        return "bg-[#182338] text-[#869ab5] border-[#25395a]";
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-xl border transition-all duration-150 mb-3 select-none ${
        isSelected
          ? "bg-[#112444] border-[#2563eb] shadow-md shadow-blue-950/40"
          : "bg-[#131e33] border-[#1e2f4e]/80 hover:bg-[#16233d] hover:border-[#2b4169]"
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between p-3.5 sm:p-4 gap-3 lg:gap-4">
        {/* Left Section: Checkbox + Title + Description */}
        <div className="flex items-start lg:items-center gap-3.5 flex-1 min-w-0">
          {/* Status Checkbox Button */}
          <button
            type="button"
            onClick={handleToggle}
            disabled={isToggling}
            aria-label={`Mark task ${task.title} as ${isCompleted ? "To Do" : "Done"}`}
            className={`mt-0.5 lg:mt-0 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-all cursor-pointer ${
              isCompleted
                ? "bg-[#3b82f6] text-white border border-[#2563eb] shadow-sm"
                : "border border-[#3b5279] hover:border-[#60a5fa] bg-[#0f172a]/60"
            }`}
          >
            {isToggling ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            ) : isCompleted ? (
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : null}
          </button>

          {/* Title & Truncated Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1 min-w-0">
            <h3
              className={`text-sm font-medium tracking-tight truncate ${
                isCompleted
                  ? "line-through text-[#6e85a0]"
                  : "text-[#f8fafc] group-hover:text-white"
              }`}
            >
              {task.title}
            </h3>
            <p className="text-xs text-[#7f98b3] truncate hidden sm:block">
              {task.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Middle/Right Section: Date, Status, Priority, and Action Buttons */}
        <div className="flex items-center justify-between lg:justify-end gap-3 sm:gap-6 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#1e2f4e]/50">
          {/* Date Created Column */}
          <div className="flex flex-col items-start min-w-[80px]">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#7f98b3]">
              Date Created
            </span>
            <span className="text-xs text-[#cad5e2] font-mono mt-0.5">
              {formatDate(task.createdAt)}
            </span>
          </div>

          {/* Status Badge Column */}
          <div className="relative flex flex-col items-start min-w-[85px]">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#7f98b3]">
              Status
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowStatusMenu(!showStatusMenu);
                setShowPriorityMenu(false);
              }}
              className={`mt-0.5 px-2.5 py-0.5 text-xs font-medium rounded-md border transition-all cursor-pointer ${getStatusBadgeStyle(
                task.status
              )}`}
            >
              {task.status}
            </button>

            {/* Quick Status Dropdown Menu */}
            {showStatusMenu && onUpdateStatus && (
              <div
                className="absolute top-12 left-0 z-30 bg-[#0f172a] border border-[#1e2f4e] rounded-lg shadow-xl p-1 w-32 space-y-0.5"
                onClick={(e) => e.stopPropagation()}
              >
                {(["To Do", "In Progress", "Done"] as TaskStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setShowStatusMenu(false);
                      onUpdateStatus(task, status);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded transition-colors ${
                      task.status === status
                        ? "bg-[#1e2f4e] text-white font-medium"
                        : "text-[#7f98b3] hover:text-[#f8fafc] hover:bg-[#16233d]"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Priority Badge Column */}
          <div className="relative flex flex-col items-start min-w-[75px]">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#7f98b3]">
              Priority
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowPriorityMenu(!showPriorityMenu);
                setShowStatusMenu(false);
              }}
              className={`mt-0.5 px-2.5 py-0.5 text-xs font-medium rounded-md border transition-all cursor-pointer ${getPriorityBadgeStyle(
                task.priority
              )}`}
            >
              {task.priority}
            </button>

            {/* Quick Priority Dropdown Menu */}
            {showPriorityMenu && onUpdatePriority && (
              <div
                className="absolute top-12 left-0 z-30 bg-[#0f172a] border border-[#1e2f4e] rounded-lg shadow-xl p-1 w-28 space-y-0.5"
                onClick={(e) => e.stopPropagation()}
              >
                {(["Low", "Medium", "High"] as TaskPriority[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setShowPriorityMenu(false);
                      onUpdatePriority(task, p);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded transition-colors ${
                      task.priority === p
                        ? "bg-[#1e2f4e] text-white font-medium"
                        : "text-[#7f98b3] hover:text-[#f8fafc] hover:bg-[#16233d]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions Column (Pencil, Trash, Expand) */}
          <div className="flex items-center gap-1.5 ml-2">
            {/* Edit Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              title="Edit Task"
              className="p-1.5 rounded-lg border border-[#233555] text-[#7f98b3] hover:text-[#f8fafc] hover:bg-[#1b2b48] hover:border-[#38517e] transition-all cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>

            {/* Delete Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task);
              }}
              title="Delete Task"
              className="p-1.5 rounded-lg border border-[#233555] text-[#7f98b3] hover:text-red-400 hover:bg-[#341724] hover:border-red-500/40 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Expand / Details Chevron */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              title={isExpanded ? "Collapse Details" : "Expand Details"}
              className="p-1.5 rounded-lg border border-[#233555] text-[#7f98b3] hover:text-[#f8fafc] hover:bg-[#1b2b48] transition-all cursor-pointer"
            >
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details Drawer */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-[#1e2f4e]/60 text-xs text-[#a2b5cd] bg-[#0f172a]/30 rounded-b-xl space-y-2">
          <div>
            <span className="font-semibold text-[#cad5e2]">Full Description:</span>
            <p className="mt-1 whitespace-pre-wrap text-[#8da3bd] leading-relaxed">
              {task.description || "No detailed description provided."}
            </p>
          </div>
          <div className="flex items-center gap-6 text-[11px] text-[#6b829e] pt-1">
            <span>Created: {new Date(task.createdAt).toLocaleString()}</span>
            <span>Updated: {new Date(task.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

