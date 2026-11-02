"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Folder,
  Plus,
  Pencil,
  Trash2,
  Code,
  Palette,
  Layers,
  Briefcase,
  Tag,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  ICategoryResponse,
  CreateCategoryInput,
} from "@/lib/validations/category";
import CategoryModal from "./CategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";

interface CategoriesViewProps {
  onSelectCategoryTasks: (categoryName: string) => void;
}

const getCategoryIcon = (iconName?: string) => {
  switch (iconName) {
    case "Code":
      return Code;
    case "Palette":
      return Palette;
    case "Layers":
      return Layers;
    case "Briefcase":
      return Briefcase;
    case "Tag":
      return Tag;
    default:
      return Folder;
  }
};

export default function CategoriesView({
  onSelectCategoryTasks,
}: CategoriesViewProps) {
  const [categories, setCategories] = useState<ICategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<ICategoryResponse | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<ICategoryResponse | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (!ignore && data.success) {
          setCategories(data.data);
        } else if (!ignore) {
          toast.error("Failed to load categories");
        }
      } catch (err) {
        console.error(err);
        if (!ignore) toast.error("Network error while loading categories");
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const handleSaveCategory = async (data: CreateCategoryInput) => {
    try {
      if (categoryToEdit) {
        const res = await fetch(`/api/categories/${categoryToEdit._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!result.success) throw new Error(result.message);
        toast.success(`Category "${data.name}" updated successfully`);
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!result.success) throw new Error(result.message);
        toast.success(`Category "${data.name}" created successfully`);
      }

      setIsModalOpen(false);
      setCategoryToEdit(null);
      triggerRefresh();
    } catch (err) {
      toast.error((err as Error).message || "Failed to save category");
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      const res = await fetch(`/api/categories/${categoryToDelete._id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      toast.success(`Category "${categoryToDelete.name}" deleted`);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      triggerRefresh();
    } catch (err) {
      toast.error((err as Error).message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e2f4e]/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#f8fafc]">
            Categories
          </h1>
          <p className="text-xs text-[#7f98b3] mt-0.5">
            Organize, tag, and segment tasks across domains and initiatives
          </p>
        </div>
        <button
          onClick={() => {
            setCategoryToEdit(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#1d4ed8] hover:bg-[#2563eb] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-blue-600/20 active:scale-[0.98] transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Grid of Categories */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-36 rounded-xl border border-[#1e2f4e]/60 bg-[#131e33]/70 p-5 animate-pulse flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="h-4 bg-[#1e2f4e] rounded w-1/2" />
                <div className="h-3 bg-[#17253d] rounded w-3/4" />
              </div>
              <div className="h-3 bg-[#1e2f4e] rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-[#1e2f4e]/80 bg-[#111c30]/80 p-12 text-center flex flex-col items-center justify-center my-8">
          <div className="w-12 h-12 rounded-xl bg-[#16233d] border border-[#233555] flex items-center justify-center text-[#60a5fa] mb-3">
            <Folder className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#f8fafc]">
            No categories defined
          </h3>
          <p className="text-xs text-[#7f98b3] max-w-sm mt-1 mb-5">
            Create categories to group tasks by initiative, client, or team.
          </p>
          <button
            onClick={() => {
              setCategoryToEdit(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#1d4ed8] hover:bg-[#2563eb] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Category</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.icon);
            const count = category.taskCount ?? 0;

            return (
              <div
                key={category._id}
                className="group relative rounded-xl border border-[#1e2f4e]/80 bg-[#131e33] hover:bg-[#16233d] hover:border-[#2b4169] transition-all duration-150 p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Card Top: Icon & Color Dot & Actions */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center border shadow-inner"
                        style={{
                          backgroundColor: `${category.color}20`,
                          borderColor: `${category.color}40`,
                          color: category.color,
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-[#f8fafc] group-hover:text-white truncate">
                        {category.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setCategoryToEdit(category);
                          setIsModalOpen(true);
                        }}
                        title="Edit Category"
                        className="p-1 rounded text-[#7f98b3] hover:text-[#f8fafc] hover:bg-[#1e2f4e] transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setCategoryToDelete(category);
                          setIsDeleteModalOpen(true);
                        }}
                        title="Delete Category"
                        className="p-1 rounded text-[#7f98b3] hover:text-red-400 hover:bg-red-950/40 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#7f98b3] line-clamp-2 min-h-[32px]">
                    {category.description || "No description provided."}
                  </p>
                </div>

                {/* Card Footer: Task Count & Filter Link */}
                <div className="pt-4 mt-2 border-t border-[#1e2f4e]/60 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#8ca4c2] bg-[#111c30] px-2.5 py-1 rounded-md border border-[#1e2f4e]">
                    {count} {count === 1 ? "task" : "tasks"}
                  </span>
                  <button
                    onClick={() => onSelectCategoryTasks(category.name)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#60a5fa] hover:text-[#93c5fd] transition-colors cursor-pointer"
                  >
                    <span>View Tasks</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCategoryToEdit(null);
        }}
        onSubmit={handleSaveCategory}
        categoryToEdit={categoryToEdit}
      />

      {/* Delete Category Modal */}
      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        category={categoryToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

