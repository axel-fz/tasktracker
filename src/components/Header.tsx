"use client";

import React from "react";
import { Search, HelpCircle, Bell, Plus } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenNewTask: () => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
  onOpenNewTask,
}: HeaderProps) {
  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-[#1e2f4d]/80 bg-[#0b111e]/90 backdrop-blur sticky top-0 z-20">
      {/* Global Search Bar */}
      <div className="relative w-80 md:w-96">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7f98b3]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="w-full bg-[#111a2d] border border-[#1e2f4e] rounded-lg pl-10 pr-4 py-2 text-sm text-[#f8fafc] placeholder-[#627d98] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7f98b3] hover:text-[#f8fafc]"
          >
            ✕
          </button>
        )}
      </div>

      {/* Header Right Actions */}
      <div className="flex items-center gap-3">
        {/* Help Icon */}
        <button
          title="Help & Documentation"
          className="p-2 text-[#7f98b3] hover:text-[#f8fafc] hover:bg-[#131e33] rounded-lg transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notifications Icon */}
        <button
          title="Notifications"
          className="relative p-2 text-[#7f98b3] hover:text-[#f8fafc] hover:bg-[#131e33] rounded-lg transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-[#0b111e]" />
        </button>

        {/* Primary Action Button: + New Task */}
        <button
          onClick={onOpenNewTask}
          className="flex items-center gap-2 bg-[#1d4ed8] hover:bg-[#2563eb] text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-blue-600/20 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}

