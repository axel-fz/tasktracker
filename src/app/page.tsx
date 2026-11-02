"use client";

import React, { useState, useEffect, useCallback, useTransition } from "react";
import { toast } from "sonner";
import { CheckCircle2, Database, ShieldCheck, Tag, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import TaskFilterTabs, { FilterTab } from "@/components/TaskFilterTabs";
import TaskRow from "@/components/TaskRow";
import TaskModal from "@/components/TaskModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import TaskSkeletons from "@/components/TaskSkeletons";
import EmptyState from "@/components/EmptyState";
import CategoriesView from "@/components/CategoriesView";
import AnalyticsView from "@/components/AnalyticsView";
import {
  ITaskResponse,
  CreateTaskInput,
  TaskStatus,
  TaskPriority,
} from "@/lib/validations/task";
import { ICategoryResponse } from "@/lib/validations/category";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<ITaskResponse[]>([]);
  const [categories, setCategories] = useState<ICategoryResponse[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [counts, setCounts] = useState({
    all: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
  });
  const [activeTab, setActiveTab] = useState<FilterTab>("All Tasks");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, startTransition] = useTransition();

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<ITaskResponse | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<ITaskResponse | null>(null);

  // Active sidebar view: "Dashboard" | "Tasks" | "Categories" | "Analytics" | "Settings"
  const [currentView, setCurrentView] = useState("Dashboard");
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  // Fetch available categories for forms and filters
  useEffect(() => {
    let ignore = false;
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        const json = await res.json();
        if (!ignore && json.success) {
          setCategories(json.data);
        }
      } catch (err) {
        console.error("Categories fetch error:", err);
      }
    }
    loadCategories();
    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  // Fetch tasks when tab, search, category, or refreshKey changes
  useEffect(() => {
    let ignore = false;

    const loadTasks = async () => {
      try {
        const params = new URLSearchParams();
        if (activeTab !== "All Tasks") {
          params.set("status", activeTab);
        }
        if (selectedCategory) {
          params.set("category", selectedCategory);
        }
        if (searchQuery.trim()) {
          params.set("search", searchQuery.trim());
        }

        const res = await fetch(`/api/tasks?${params.toString()}`);
        const data = await res.json();

        if (!ignore && data.success) {
          setTasks(data.data);
          if (data.counts) {
            setCounts(data.counts);
          }
        }
      } catch (err) {
        console.error("Fetch tasks failed:", err);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void loadTasks();

    return () => {
      ignore = true;
    };
  }, [activeTab, searchQuery, selectedCategory, refreshKey]);

  // Quick toggle status (Done <-> To Do) with optimistic update
  const handleQuickToggleStatus = async (task: ITaskResponse) => {
    const isCurrentlyDone = task.status === "Done";
    const newStatus: TaskStatus = isCurrentlyDone ? "To Do" : "Done";

    // Optimistic local state update
    const previousTasks = [...tasks];
    const previousCounts = { ...counts };

    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
    );

    // Update counts optimistically
    setCounts((prev) => {
      const updated = { ...prev };
      if (task.status === "To Do") updated.todo = Math.max(0, updated.todo - 1);
      if (task.status === "In Progress")
        updated.inProgress = Math.max(0, updated.inProgress - 1);
      if (task.status === "Done") updated.done = Math.max(0, updated.done - 1);

      if (newStatus === "To Do") updated.todo += 1;
      if (newStatus === "Done") updated.done += 1;
      return updated;
    });

    // Custom matching toast
    if (newStatus === "Done") {
      toast.custom((t) => (
        <div className="flex items-center gap-3 bg-[#131e33] border border-[#1f304f] p-3.5 rounded-xl shadow-2xl text-sm text-[#f8fafc]">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="font-normal text-xs sm:text-sm">
            Task &apos;{task.title}&apos; moved to Done
          </span>
          <button
            onClick={() => toast.dismiss(t)}
            className="ml-auto text-[#7f98b3] hover:text-[#f8fafc] text-xs px-1"
          >
            ✕
          </button>
        </div>
      ));
    } else {
      toast(`Task '${task.title}' moved to To Do`);
    }

    try {
      const res = await fetch(`/api/tasks/${task._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();
      if (!result.success) {
        throw new Error(result.message || "Failed to update task");
      }
      startTransition(() => {
        triggerRefresh();
      });
    } catch (error) {
      console.error("Status update error:", error);
      setTasks(previousTasks);
      setCounts(previousCounts);
      toast.error("Status update failed", {
        description: "Reverted status change due to a server error.",
      });
    }
  };

  // Change status directly via dropdown
  const handleUpdateStatus = async (
    task: ITaskResponse,
    newStatus: TaskStatus
  ) => {
    if (task.status === newStatus) return;

    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
    );

    try {
      const res = await fetch(`/api/tasks/${task._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      toast.success(`Status updated to "${newStatus}"`);
      triggerRefresh();
    } catch (err) {
      console.error(err);
      setTasks(previousTasks);
      toast.error("Failed to update status");
    }
  };

  // Change priority directly via dropdown
  const handleUpdatePriority = async (
    task: ITaskResponse,
    newPriority: TaskPriority
  ) => {
    if (task.priority === newPriority) return;

    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) =>
        t._id === task._id ? { ...t, priority: newPriority } : t
      )
    );

    try {
      const res = await fetch(`/api/tasks/${task._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority: newPriority }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      toast.success(`Priority set to "${newPriority}"`);
      triggerRefresh();
    } catch (err) {
      console.error(err);
      setTasks(previousTasks);
      toast.error("Failed to update priority");
    }
  };

  // Create or Update task from modal
  const handleSaveTask = async (data: CreateTaskInput) => {
    try {
      if (taskToEdit) {
        const res = await fetch(`/api/tasks/${taskToEdit._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!result.success) throw new Error(result.message);

        toast.success("Task updated successfully in MongoDB Atlas");
      } else {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!result.success) throw new Error(result.message);

        toast.success("New task stored in MongoDB Atlas");
      }

      setIsTaskModalOpen(false);
      setTaskToEdit(null);
      triggerRefresh();
    } catch (err) {
      console.error("Save task failed:", err);
      toast.error(
        taskToEdit ? "Failed to update task" : "Failed to create task",
        {
          description:
            (err as Error).message || "An unexpected error occurred.",
        }
      );
    }
  };

  // Delete task after modal confirmation
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      const res = await fetch(`/api/tasks/${taskToDelete._id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      toast.success(`Task "${taskToDelete.title}" deleted`);
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
      triggerRefresh();
    } catch (err) {
      console.error("Delete task failed:", err);
      toast.error("Failed to delete task", {
        description: (err as Error).message || "Internal error occurred.",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b111e] text-[#f8fafc]">
      {/* 1. Left Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          if (view === "Tasks" || view === "Dashboard") {
            // Keep current filters or reset if clicking Dashboard
            if (view === "Dashboard") setSelectedCategory(null);
          }
        }}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
          onOpenNewTask={() => {
            setTaskToEdit(null);
            setIsTaskModalOpen(true);
          }}
        />

        {/* Dynamic Main View Area */}
        <main className="flex-1 px-8 py-6 max-w-7xl w-full mx-auto">
          {currentView === "Categories" ? (
            <CategoriesView
              onSelectCategoryTasks={(catName) => {
                setSelectedCategory(catName);
                setCurrentView("Tasks");
              }}
            />
          ) : currentView === "Analytics" ? (
            <AnalyticsView
              onFilterByCategory={(catName) => {
                setSelectedCategory(catName);
                setCurrentView("Tasks");
              }}
            />
          ) : currentView === "Settings" ? (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="pb-4 border-b border-[#1e2f4e]/80">
                <h1 className="text-xl font-bold tracking-tight text-[#f8fafc]">
                  System & Database Settings
                </h1>
                <p className="text-xs text-[#7f98b3] mt-0.5">
                  Environment connection parameters and infrastructure health
                </p>
              </div>

              <div className="rounded-xl border border-[#1e2f4e]/80 bg-[#131e33] p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#f8fafc]">
                      MongoDB Atlas Cloud Storage
                    </h2>
                    <p className="text-xs text-[#7f98b3]">
                      Connected to remote cluster replica set
                    </p>
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#1e2f4e]/60 text-xs">
                  <div className="p-3 bg-[#0d1627] rounded-lg border border-[#1e2f4e]">
                    <span className="text-[#7f98b3] block font-medium">Cluster Host</span>
                    <span className="text-[#f8fafc] font-mono mt-0.5 block">
                      tasktracker.rnv70gc.mongodb.net
                    </span>
                  </div>
                  <div className="p-3 bg-[#0d1627] rounded-lg border border-[#1e2f4e]">
                    <span className="text-[#7f98b3] block font-medium">Database Name</span>
                    <span className="text-[#f8fafc] font-mono mt-0.5 block">
                      tasktracker
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 text-xs text-[#7f98b3]">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    Authenticated with encrypted TLS connection and strict Mongoose schema validation.
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Main Task Tracker Dashboard View */
            <div>
              {/* Category Filter Pill (if selected) */}
              {selectedCategory && (
                <div className="flex items-center gap-2 mb-4 bg-[#14233c] border border-[#233b63] rounded-lg px-3 py-1.5 w-fit text-xs text-[#93c5fd]">
                  <Tag className="w-3.5 h-3.5 text-blue-400" />
                  <span>
                    Category: <strong className="text-white">{selectedCategory}</strong>
                  </span>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    title="Clear category filter"
                    className="ml-1 p-0.5 rounded hover:bg-[#1e345b] text-[#7f98b3] hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* View Heading & Filter Tabs */}
              <div className="mb-2">
                <TaskFilterTabs
                  activeTab={activeTab}
                  onTabChange={(tab) => setActiveTab(tab)}
                  counts={counts}
                />
              </div>

              {/* Task Rows List / Loading / Empty States */}
              {isLoading ? (
                <TaskSkeletons count={6} />
              ) : tasks.length === 0 ? (
                <EmptyState
                  isSearchActive={Boolean(searchQuery.trim()) || Boolean(selectedCategory)}
                  filterTab={activeTab}
                  onClearFilters={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                    setActiveTab("All Tasks");
                  }}
                  onOpenNewTask={() => {
                    setTaskToEdit(null);
                    setIsTaskModalOpen(true);
                  }}
                />
              ) : (
                <div className="space-y-2.5">
                  {tasks.map((task) => (
                    <TaskRow
                      key={task._id}
                      task={task}
                      isSelected={selectedTaskId === task._id}
                      onSelect={() =>
                        setSelectedTaskId(
                          selectedTaskId === task._id ? null : task._id
                        )
                      }
                      onQuickToggleStatus={handleQuickToggleStatus}
                      onEdit={(t) => {
                        setTaskToEdit(t);
                        setIsTaskModalOpen(true);
                      }}
                      onDelete={(t) => {
                        setTaskToDelete(t);
                        setIsDeleteModalOpen(true);
                      }}
                      onUpdateStatus={handleUpdateStatus}
                      onUpdatePriority={handleUpdatePriority}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* 3. Create / Edit Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSubmit={handleSaveTask}
        taskToEdit={taskToEdit}
        categories={categories}
      />

      {/* 4. Delete Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        task={taskToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
