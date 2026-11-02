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
        return "badge-status-done";
      case "In Progress":
        return "badge-status-inprogress";
      case "To Do":
      default:
        return "badge-status-todo";
    }
  };

  const getPriorityBadgeStyle = (priority: TaskPriority) => {
    switch (priority) {
      case "High":
        return "badge-priority-high";
      case "Medium":
        return "badge-priority-medium";
      case "Low":
      default:
        return "badge-priority-low";
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-xl border transition-all duration-150 mb-3 select-none ${
        isSelected
          ? "bg-[#edf3e3] border-[#809c13] shadow-md dark:bg-[#27371c] dark:border-[#b5e550]"
          : "bg-white border-[#dbe4cd] hover:border-[#b5c4a3] hover:bg-[#fafbf6] dark:bg-[#182212] dark:border-[#2e3e22] dark:hover:bg-[#212d19] dark:hover:border-[#475f34] shadow-xs"
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
                ? "bg-gradient-to-r from-[#809c13] to-[#607c3c] dark:from-[#b5e550] dark:to-[#abc32f] text-white dark:text-[#0f160b] border border-[#809c13] dark:border-[#b5e550] shadow-sm font-bold"
                : "border border-[#c5d4b4] hover:border-[#809c13] bg-white dark:border-[#354724] dark:hover:border-[#b5e550] dark:bg-[#12190d]/60 shadow-2xs"
            }`}
          >
            {isToggling ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#809c13] dark:text-white" />
            ) : isCompleted ? (
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : null}
          </button>

          {/* Title & Truncated Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <h3
                className={`text-sm font-semibold tracking-tight truncate ${
                  isCompleted
                    ? "line-through text-[#8c9e80] dark:text-[#6e85a0]"
                    : "text-[#18220f] dark:text-[#f8fafc] group-hover:text-[#0f160b] dark:group-hover:text-white"
                }`}
              >
                {task.title}
              </h3>
              {task.category && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#edf3e3] text-[#4d6334] font-medium border border-[#d2ded0] dark:bg-[#1e2b17] dark:text-[#abc32f] dark:border-[#344626] flex-shrink-0 hidden xs:inline-block">
                  {task.category}
                </span>
              )}
            </div>
            <p className="text-xs text-[#5f7052] dark:text-[#7f98b3] truncate hidden sm:block">
              {task.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Middle/Right Section: Date, Status, Priority, and Action Buttons */}
        <div className="flex items-center justify-between lg:justify-end gap-2 sm:gap-4 lg:gap-6 pt-2.5 lg:pt-0 border-t lg:border-t-0 border-[#dbe4cd]/70 dark:border-[#1e2f4e]/50 flex-wrap sm:flex-nowrap">
          {/* Date Created Column */}
          <div className="hidden xs:flex flex-col items-start min-w-[65px] sm:min-w-[80px]">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#5f7052] dark:text-[#7f98b3]">
              Date Created
            </span>
            <span className="text-xs text-[#3b4931] dark:text-[#cad5e2] font-mono mt-0.5">
              {formatDate(task.createdAt)}
            </span>
          </div>

          {/* Status Badge Column */}
          <div className="relative flex flex-col items-start min-w-[75px] sm:min-w-[85px]">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#5f7052] dark:text-[#7f98b3]">
              Status
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowStatusMenu(!showStatusMenu);
                setShowPriorityMenu(false);
              }}
              className={`mt-0.5 px-2.5 py-0.5 text-xs font-semibold rounded-md border transition-all cursor-pointer shadow-2xs hover:brightness-95 dark:hover:brightness-125 ${getStatusBadgeStyle(
                task.status
              )}`}
            >
              {task.status}
            </button>

            {/* Quick Status Dropdown Menu */}
            {showStatusMenu && onUpdateStatus && (
              <div
                className="absolute top-11 left-0 z-30 bg-white dark:bg-[#141c0e] border border-[#dbe4cd] dark:border-[#2e3e22] rounded-lg shadow-xl shadow-black/10 dark:shadow-black/50 p-1 w-32 space-y-0.5"
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
                        ? "bg-[#edf3e3] text-[#33461c] font-semibold dark:bg-[#27371c] dark:text-white"
                        : "text-[#5f7052] hover:text-[#18220f] hover:bg-[#f4f6ec] dark:text-[#94a888] dark:hover:text-[#f4f7f0] dark:hover:bg-[#1e2b17]"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Priority Badge Column */}
          <div className="relative flex flex-col items-start min-w-[70px] sm:min-w-[75px]">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#5f7052] dark:text-[#7f98b3]">
              Priority
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowPriorityMenu(!showPriorityMenu);
                setShowStatusMenu(false);
              }}
              className={`mt-0.5 px-2.5 py-0.5 text-xs font-semibold rounded-md border transition-all cursor-pointer shadow-2xs hover:brightness-95 dark:hover:brightness-125 ${getPriorityBadgeStyle(
                task.priority
              )}`}
            >
              {task.priority}
            </button>

            {/* Quick Priority Dropdown Menu */}
            {showPriorityMenu && onUpdatePriority && (
              <div
                className="absolute top-11 right-0 sm:right-auto sm:left-0 z-30 bg-white dark:bg-[#141c0e] border border-[#dbe4cd] dark:border-[#2e3e22] rounded-lg shadow-xl shadow-black/10 dark:shadow-black/50 p-1 w-28 space-y-0.5"
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
                        ? "bg-[#edf3e3] text-[#33461c] font-semibold dark:bg-[#27371c] dark:text-white"
                        : "text-[#5f7052] hover:text-[#18220f] hover:bg-[#f4f6ec] dark:text-[#94a888] dark:hover:text-[#f4f7f0] dark:hover:bg-[#1e2b17]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions Column (Pencil, Trash, Expand) */}
          <div className="flex items-center gap-1 sm:gap-1.5 ml-auto sm:ml-2">
            {/* Edit Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              title="Edit Task"
              className="p-1.5 rounded-lg border border-[#dbe4cd] text-[#5f7052] hover:text-[#18220f] hover:bg-[#f4f6ec] hover:border-[#b5c4a3] dark:border-[#2e3e22] dark:text-[#94a888] dark:hover:text-[#f4f7f0] dark:hover:bg-[#212d19] dark:hover:border-[#475f34] transition-all cursor-pointer shadow-2xs"
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
              className="p-1.5 rounded-lg border border-[#dbe4cd] text-[#5f7052] hover:text-red-600 hover:bg-red-50 hover:border-red-200 dark:border-[#2e3e22] dark:text-[#94a888] dark:hover:text-red-400 dark:hover:bg-[#341724] dark:hover:border-red-500/40 transition-all cursor-pointer shadow-2xs"
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
              className="p-1.5 rounded-lg border border-[#dbe4cd] text-[#5f7052] hover:text-[#18220f] hover:bg-[#f4f6ec] dark:border-[#2e3e22] dark:text-[#94a888] dark:hover:text-[#f4f7f0] dark:hover:bg-[#212d19] transition-all cursor-pointer shadow-2xs"
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
        <div className="px-4 pb-4 pt-2 border-t border-[#dbe4cd] dark:border-[#2e3e22] text-xs text-[#5f7052] dark:text-[#a2b5cd] bg-[#fbfbf6] dark:bg-[#12190d]/40 rounded-b-xl space-y-2">
          <div>
            <span className="font-semibold text-[#18220f] dark:text-[#cad5e2]">Full Description:</span>
            <p className="mt-1 whitespace-pre-wrap text-[#3b4931] dark:text-[#8da3bd] leading-relaxed">
              {task.description || "No detailed description provided."}
            </p>
          </div>
          <div className="flex items-center gap-6 text-[11px] text-[#728567] dark:text-[#6b829e] pt-1">
            <span>Created: {new Date(task.createdAt).toLocaleString()}</span>
            <span>Updated: {new Date(task.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

