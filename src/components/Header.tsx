"use client";

import React from "react";
import { Search, HelpCircle, Bell, Plus, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenNewTask: () => void;
  onOpenMobileMenu?: () => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
  onOpenNewTask,
  onOpenMobileMenu,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-[#1e2f4d]/80 bg-[#0b111e]/90 backdrop-blur sticky top-0 z-20 gap-3">
      {/* Left: Mobile Hamburger Toggle + Search Bar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        {/* Mobile Menu Hamburger (Visible on < 1024px) */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open mobile navigation"
          className="p-2 -ml-1 text-[#7f98b3] hover:text-[#f8fafc] hover:bg-[#131e33] rounded-lg lg:hidden transition-colors cursor-pointer shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-[200px] xs:max-w-[240px] sm:max-w-xs md:max-w-sm lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7f98b3]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="w-full bg-[#111a2d] border border-[#1e2f4e] rounded-lg pl-9 pr-7 sm:pl-10 sm:pr-8 py-1.5 sm:py-2 text-xs sm:text-sm text-[#f8fafc] placeholder-[#627d98] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#7f98b3] hover:text-[#f8fafc] p-0.5"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Header Right Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Quick Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          title={
            theme === "light"
              ? "Switch to Dark Navy Mode"
              : "Switch to White / Light Mode"
          }
          aria-label="Toggle theme mode"
          className="p-1.5 sm:p-2 text-[#7f98b3] hover:text-[#f8fafc] hover:bg-[#131e33] rounded-lg transition-colors cursor-pointer"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          ) : (
            <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          )}
        </button>

        {/* Help Icon (hidden on smaller mobile screens) */}
        <button
          title="Help & Documentation"
          className="hidden md:flex p-2 text-[#7f98b3] hover:text-[#f8fafc] hover:bg-[#131e33] rounded-lg transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notifications Icon */}
        <button
          title="Notifications"
          className="relative p-1.5 sm:p-2 text-[#7f98b3] hover:text-[#f8fafc] hover:bg-[#131e33] rounded-lg transition-colors"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full ring-2 ring-[#0b111e]" />
        </button>

        {/* Primary Action Button: + New Task */}
        <button
          onClick={onOpenNewTask}
          className="flex items-center gap-1 sm:gap-2 bg-[#1d4ed8] hover:bg-[#2563eb] text-white text-xs sm:text-sm font-semibold px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md hover:shadow-blue-600/20 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline">New Task</span>
          <span className="xs:hidden">New</span>
        </button>
      </div>
    </header>
  );
}
