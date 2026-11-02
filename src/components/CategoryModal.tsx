"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";
import {
  createCategorySchema,
  CreateCategoryInput,
  ICategoryResponse,
} from "@/lib/validations/category";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCategoryInput) => Promise<void>;
  categoryToEdit?: ICategoryResponse | null;
}

const PRESET_COLORS = [
  { name: "Ocean Blue", hex: "#3b82f6" },
  { name: "Indigo", hex: "#6366f1" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Coral Rose", hex: "#f43f5e" },
  { name: "Cyan Sky", hex: "#06b6d4" },
];

export default function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  categoryToEdit,
}: CategoryModalProps) {
  const isEditing = Boolean(categoryToEdit);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema) as any,
    defaultValues: {
      name: categoryToEdit?.name || "",
      color: categoryToEdit?.color || "#3b82f6",
      icon: categoryToEdit?.icon || "Folder",
      description: categoryToEdit?.description || "",
    },
  });

  const selectedColor = useWatch({ control, name: "color" }) || "#3b82f6";
  const nameValue = useWatch({ control, name: "name" }) || "";

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

  const handleFormSubmit: SubmitHandler<CreateCategoryInput> = async (data) => {
    await onSubmit(data);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => {
        if (!isSubmitting) onClose();
      }}
    >
      <div
        className="w-full max-w-md bg-[#111c30] border border-[#1e2f4e] rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2f4e]/80 bg-[#131e33]">
          <div>
            <h2 className="text-lg font-bold text-[#f8fafc]">
              {isEditing ? "Edit Category" : "New Category"}
            </h2>
            <p className="text-xs text-[#7f98b3] mt-0.5">
              Organize your tasks into structured domains
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-[#7f98b3] hover:text-[#f8fafc] hover:bg-[#1e2f4e] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          {/* Name Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="cat-name"
                className="text-xs font-semibold text-[#cad5e2]"
              >
                Category Name <span className="text-red-400">*</span>
              </label>
              <span className="text-[11px] text-[#627d98]">
                {nameValue.length}/50
              </span>
            </div>
            <input
              id="cat-name"
              type="text"
              placeholder="e.g. Engineering, Design, Operations"
              maxLength={50}
              {...register("name")}
              className={`w-full bg-[#0d1627] border rounded-lg px-3.5 py-2.5 text-sm text-[#f8fafc] placeholder-[#506883] focus:outline-none focus:ring-1 transition-all ${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#1e2f4e] focus:border-blue-500 focus:ring-blue-500"
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#cad5e2] mb-2">
              Color Accent
            </label>
            <div className="flex items-center gap-2.5 flex-wrap">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => setValue("color", color.hex)}
                  title={color.name}
                  style={{ backgroundColor: color.hex }}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                    selectedColor.toLowerCase() === color.hex.toLowerCase()
                      ? "ring-2 ring-white ring-offset-2 ring-offset-[#111c30] scale-110 shadow-lg"
                      : "opacity-80 hover:opacity-100 hover:scale-105"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor="cat-description"
              className="block text-xs font-semibold text-[#cad5e2] mb-1.5"
            >
              Description (Optional)
            </label>
            <textarea
              id="cat-description"
              rows={2}
              placeholder="What belongs in this category?"
              maxLength={200}
              {...register("description")}
              className="w-full bg-[#0d1627] border border-[#1e2f4e] rounded-lg px-3.5 py-2 text-sm text-[#f8fafc] placeholder-[#506883] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e2f4e]/80">
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
              <span>{isEditing ? "Save Changes" : "Create Category"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

