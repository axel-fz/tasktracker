"use client";

import React from "react";

export type FilterTab = "All Tasks" | "To Do" | "In Progress" | "Done";

interface TaskFilterTabsProps {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  counts: {
    all: number;
    todo: number;
    inProgress: number;
    done: number;
  };
}

export default function TaskFilterTabs({
  activeTab,
  onTabChange,
  counts,
}: TaskFilterTabsProps) {
  const tabs: { id: FilterTab; label: string; count?: number }[] = [
    { id: "All Tasks", label: "All Tasks" },
    { id: "To Do", label: "To Do", count: counts.todo },
    { id: "In Progress", label: "In Progress", count: counts.inProgress },
    { id: "Done", label: "Done", count: counts.done },
  ];

  return (
    <div className="flex items-center gap-4 sm:gap-6 border-b border-[#1e2f4d]/80 pb-px mb-6 overflow-x-auto no-scrollbar whitespace-nowrap touch-pan-x">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative pb-3 text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              isActive
                ? "text-[#f8fafc]"
                : "text-[#7f98b3] hover:text-[#cad5e2]"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                  isActive
                    ? "bg-[#b5e550]/15 text-[#b5e550] font-semibold"
                    : "text-[#7f98b3]"
                }`}
              >
                ({tab.count})
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#b5e550] to-[#abc32f] rounded-t-sm" />
            )}
          </button>
        );
      })}
    </div>
  );
}

