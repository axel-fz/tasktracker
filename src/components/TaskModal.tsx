"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";
import {
  createTaskSchema,
  CreateTaskInput,
  ITaskResponse,
  TASK_STATUSES,
  TASK_PRIORITIES,
} from "@/lib/validations/task";

interface CategoryOption {
  _id: string;
  name: string;
  color?: string;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskInput) => Promise<void>;
  taskToEdit?: ITaskResponse | null;
  categories?: CategoryOption[];
  defaultCategory?: string | null;
}

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  taskToEdit,
  categories = [],
  defaultCategory,
}: TaskModalProps) {
  const isEditing = Boolean(taskToEdit);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema) as any,
    defaultValues: {
      title: taskToEdit?.title || "",
      description: taskToEdit?.description || "",
      status: taskToEdit?.status || "To Do",
      priority: taskToEdit?.priority || "Medium",
      category: taskToEdit?.category || defaultCategory || "General",
    },
  });

  const titleValue = useWatch({ control, name: "title" }) || "";
  const descriptionValue = useWatch({ control, name: "description" }) || "";

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleFormSubmit: SubmitHandler<CreateTaskInput> = async (data) => {
    await onSubmit(data);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => {
        if (!isSubmitting) onClose();
      }}
    >
      <div
        className="w-full max-w-lg bg-[#111c30] border border-[#1e2f4e] rounded-xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#1e2f4e]/80 bg-[#131e33] shrink-0">
          <div>
            <h2 id="modal-title" className="text-base sm:text-lg font-bold text-[#f8fafc]">
              {isEditing ? "Edit Task" : "Create New Task"}
            </h2>
            <p className="text-xs text-[#7f98b3] mt-0.5">
              {isEditing
                ? "Update existing task details and properties"
                : "Fill in the details below to add a new task"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-[#7f98b3] hover:text-[#f8fafc] hover:bg-[#1e2f4e] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Title Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="task-title"
                className="text-xs font-semibold text-[#cad5e2]"
              >
                Task Title
              </label>
              <span className={`text-[11px] ${titleValue.length >= 110 ? "text-amber-400 font-semibold" : "text-[#627d98]"}`}>
                {titleValue.length}/120
              </span>
            </div>
            <input
              id="task-title"
              type="text"
              autoFocus
              placeholder="e.g. Implement MongoDB Schema"
              maxLength={120}
              {...register("title")}
              className={`w-full bg-[#0d1627] border rounded-lg px-3.5 py-2.5 text-sm text-[#f8fafc] placeholder-[#506883] focus:outline-none focus:ring-1 transition-all ${
                errors.title
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#1e2f4e] focus:border-blue-500 focus:ring-blue-500"
              }`}
            />
            {errors.title && (
              <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="task-description"
                className="text-xs font-semibold text-[#cad5e2]"
              >
                Description
              </label>
              <span className={`text-[11px] ${descriptionValue.length >= 450 ? "text-amber-400 font-semibold" : "text-[#627d98]"}`}>
                {descriptionValue.length}/500
              </span>
            </div>
            <textarea
              id="task-description"
              rows={3}
              placeholder="Provide context or instructions for this task..."
              maxLength={500}
              {...register("description")}
              className={`w-full bg-[#0d1627] border rounded-lg px-3.5 py-2.5 text-sm text-[#f8fafc] placeholder-[#506883] focus:outline-none focus:ring-1 transition-all resize-none ${
                errors.description
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#1e2f4e] focus:border-blue-500 focus:ring-blue-500"
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-400 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category, Status & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Category Select */}
            <div>
              <label
                htmlFor="task-category"
                className="block text-xs font-semibold text-[#cad5e2] mb-1.5"
              >
                Category
              </label>
              <select
                id="task-category"
                {...register("category")}
                className="w-full bg-[#0d1627] border border-[#1e2f4e] rounded-lg px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option value="General" className="bg-[#111c30]">
                  General
                </option>
                {categories
                  .filter((c) => c.name.toLowerCase() !== "general")
                  .map((c) => (
                    <option key={c._id} value={c.name} className="bg-[#111c30]">
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Status Select */}
            <div>
              <label
                htmlFor="task-status"
                className="block text-xs font-semibold text-[#cad5e2] mb-1.5"
              >
                Status
              </label>
              <select
                id="task-status"
                {...register("status")}
                className="w-full bg-[#0d1627] border border-[#1e2f4e] rounded-lg px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
              >
                {TASK_STATUSES.map((status) => (
                  <option key={status} value={status} className="bg-[#111c30]">
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Select */}
            <div>
              <label
                htmlFor="task-priority"
                className="block text-xs font-semibold text-[#cad5e2] mb-1.5"
              >
                Priority
              </label>
              <select
                id="task-priority"
                {...register("priority")}
                className="w-full bg-[#0d1627] border border-[#1e2f4e] rounded-lg px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
              >
                {TASK_PRIORITIES.map((priority) => (
                  <option key={priority} value={priority} className="bg-[#111c30]">
                    {priority}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Modal Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e2f4e]/80">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-[#7f98b3] hover:text-[#f8fafc] hover:bg-[#1a2742] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-[#1d4ed8] hover:bg-[#2563eb] disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-md hover:shadow-blue-600/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isEditing ? "Save Changes" : "Create Task"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
