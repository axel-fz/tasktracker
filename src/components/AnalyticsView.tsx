"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Folder,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import { ITaskResponse } from "@/lib/validations/task";

interface AnalyticsData {
  metrics: {
    totalTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    doneTasks: number;
    completionRate: number;
    highPriorityPending: number;
  };
  statusBreakdown: {
    status: string;
    count: number;
    percentage: number;
    color: string;
  }[];
  priorityBreakdown: {
    priority: string;
    count: number;
    percentage: number;
    color: string;
  }[];
  categoryBreakdown: {
    name: string;
    count: number;
    percentage: number;
    color: string;
  }[];
  highPriorityTasks: ITaskResponse[];
}

interface AnalyticsViewProps {
  onNavigateToTask?: (taskId: string) => void;
  onFilterByCategory?: (category: string) => void;
}

export default function AnalyticsView({
  onFilterByCategory,
}: AnalyticsViewProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshKey((k) => k + 1);
  };

  useEffect(() => {
    let ignore = false;

    async function loadAnalytics() {
      try {
        const res = await fetch("/api/analytics");
        const json = await res.json();
        if (!ignore && json.success) {
          setData(json.data);
        } else if (!ignore) {
          toast.error("Failed to load analytics");
        }
      } catch (err) {
        console.error(err);
        if (!ignore) toast.error("Network error while loading analytics");
      } finally {
        if (!ignore) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    }

    loadAnalytics();

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  if (isLoading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-[#1e2f4e]/60 rounded w-1/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-[#131e33] border border-[#1e2f4e]/60" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 rounded-xl bg-[#131e33] border border-[#1e2f4e]/60" />
          <div className="h-64 rounded-xl bg-[#131e33] border border-[#1e2f4e]/60" />
        </div>
      </div>
    );
  }

  const { metrics, statusBreakdown, priorityBreakdown, categoryBreakdown, highPriorityTasks } =
    data;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e2f4e]/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#f8fafc]">
            Analytics & Insights
          </h1>
          <p className="text-xs text-[#7f98b3] mt-0.5">
            Real-time health, velocity, and workload metrics from MongoDB Atlas
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 bg-[#16233d] hover:bg-[#1b2b48] border border-[#25395c] text-[#f8fafc] text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-400" : "text-[#7f98b3]"}`}
          />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 1. Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="rounded-xl border border-[#1e2f4e]/80 bg-[#131e33] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7f98b3]">Total Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#f8fafc] tracking-tight">
              {metrics.totalTasks}
            </div>
            <p className="text-[11px] text-[#7f98b3] mt-1">
              {metrics.doneTasks} completed · {metrics.inProgressTasks + metrics.todoTasks} active
            </p>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="rounded-xl border border-[#1e2f4e]/80 bg-[#131e33] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7f98b3]">Completion Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#f8fafc] tracking-tight">
              {metrics.completionRate}%
            </div>
            <div className="w-full bg-[#0d1627] rounded-full h-1.5 mt-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="rounded-xl border border-[#1e2f4e]/80 bg-[#131e33] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7f98b3]">In Progress</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#f8fafc] tracking-tight">
              {metrics.inProgressTasks}
            </div>
            <p className="text-[11px] text-[#7f98b3] mt-1">
              Active workload in current cycle
            </p>
          </div>
        </div>

        {/* High Priority Urgent */}
        <div className="rounded-xl border border-[#1e2f4e]/80 bg-[#131e33] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7f98b3]">High Priority Pending</span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#f8fafc] tracking-tight">
              {metrics.highPriorityPending}
            </div>
            <p className="text-[11px] text-red-400/90 mt-1 font-medium">
              Requires immediate action
            </p>
          </div>
        </div>
      </div>

      {/* 2. Visual Breakdowns Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="rounded-xl border border-[#1e2f4e]/80 bg-[#131e33] p-5">
          <h2 className="text-sm font-bold text-[#f8fafc] mb-4">
            Status Distribution
          </h2>
          {/* Progress Stack Bar */}
          <div className="w-full h-3 rounded-full bg-[#0d1627] flex overflow-hidden mb-5">
            {statusBreakdown.map((item) => (
              <div
                key={item.status}
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
                title={`${item.status}: ${item.count} (${item.percentage}%)`}
                className="h-full transition-all duration-300"
              />
            ))}
          </div>

          <div className="space-y-3">
            {statusBreakdown.map((item) => (
              <div key={item.status} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[#cad5e2] font-medium">{item.status}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#7f98b3] font-mono">{item.count} tasks</span>
                  <span className="text-[#f8fafc] font-semibold w-10 text-right font-mono">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="rounded-xl border border-[#1e2f4e]/80 bg-[#131e33] p-5">
          <h2 className="text-sm font-bold text-[#f8fafc] mb-4">
            Priority Breakdown
          </h2>
          {/* Priority Distribution Bar */}
          <div className="w-full h-3 rounded-full bg-[#0d1627] flex overflow-hidden mb-5">
            {priorityBreakdown.map((item) => (
              <div
                key={item.priority}
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
                title={`${item.priority}: ${item.count} (${item.percentage}%)`}
                className="h-full transition-all duration-300"
              />
            ))}
          </div>

          <div className="space-y-3">
            {priorityBreakdown.map((item) => (
              <div key={item.priority} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[#cad5e2] font-medium">{item.priority}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#7f98b3] font-mono">{item.count} tasks</span>
                  <span className="text-[#f8fafc] font-semibold w-10 text-right font-mono">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Category Breakdown & Urgent Tasks Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="rounded-xl border border-[#1e2f4e]/80 bg-[#131e33] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#f8fafc]">
              Tasks by Category
            </h2>
            <Folder className="w-4 h-4 text-[#7f98b3]" />
          </div>

          {categoryBreakdown.length === 0 ? (
            <p className="text-xs text-[#7f98b3] py-4">No categories assigned.</p>
          ) : (
            <div className="space-y-3.5">
              {categoryBreakdown.map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <button
                      onClick={() => onFilterByCategory && onFilterByCategory(cat.name)}
                      className="flex items-center gap-2 text-[#cad5e2] hover:text-white transition-colors cursor-pointer"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="font-medium">{cat.name}</span>
                    </button>
                    <span className="text-[#7f98b3] font-mono">
                      {cat.count} {cat.count === 1 ? "task" : "tasks"} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#0d1627] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* High Priority Urgent Tasks */}
        <div className="rounded-xl border border-[#1e2f4e]/80 bg-[#131e33] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#f8fafc]">
              Urgent High-Priority Tasks
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-wider text-red-400 bg-red-950/60 border border-red-500/30 px-2 py-0.5 rounded">
              Needs Attention
            </span>
          </div>

          {highPriorityTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
              <p className="text-xs text-[#cad5e2] font-semibold">
                No urgent tasks pending!
              </p>
              <p className="text-[11px] text-[#7f98b3] mt-0.5">
                All high priority tasks are completed.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {highPriorityTasks.map((t) => (
                <div
                  key={t._id}
                  className="p-3 rounded-lg bg-[#0f172a] border border-[#1e2f4e] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#f8fafc] truncate">
                      {t.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1e2f4e] text-[#93c5fd] font-medium">
                        {t.category || "General"}
                      </span>
                      <span className="text-[10px] text-[#7f98b3]">
                        {t.status}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#381c2b] text-[#f87171] border border-[#ef4444]/40 flex-shrink-0">
                    High
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

