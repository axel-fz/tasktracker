"use client";

import React from "react";
import {
  LayoutDashboard,
  CheckSquare,
  Folder,
  TrendingUp,
  Settings,
  MoreVertical,
} from "lucide-react";

interface SidebarProps {
  currentView?: string;
  onNavigate?: (view: string) => void;
}

export default function Sidebar({
  currentView = "Dashboard",
  onNavigate,
}: SidebarProps) {
  const mainNavItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Tasks", icon: CheckSquare },
    { label: "Categories", icon: Folder },
    { label: "Analytics", icon: TrendingUp },
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col justify-between h-screen sticky top-0 bg-[#0d1527] border-r border-[#1e2f4d]/80 select-none">
      {/* Top Branding & Main Navigation */}
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-[#1e2f4d]/60">
          <span className="text-xl font-bold tracking-tight text-[#f8fafc]">
            Task Tracker
          </span>
        </div>

        {/* Primary Navigation Links */}
        <nav className="p-3 space-y-1 mt-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.label;

            return (
              <button
                key={item.label}
                onClick={() => onNavigate && onNavigate(item.label)}
                className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#16233d] text-[#60a5fa]"
                    : "text-[#7f98b3] hover:text-[#f8fafc] hover:bg-[#131e33]"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#3b82f6] rounded-r-md" />
                )}
                <Icon className={`w-4 h-4 ${isActive ? "text-[#60a5fa]" : "text-[#7f98b3]"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Secondary Settings & Profile Pill */}
      <div className="p-3 space-y-3 border-t border-[#1e2f4d]/60">
        <button
          onClick={() => onNavigate && onNavigate("Settings")}
          className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            currentView === "Settings"
              ? "bg-[#16233d] text-[#60a5fa]"
              : "text-[#7f98b3] hover:text-[#f8fafc] hover:bg-[#131e33]"
          }`}
        >
          {currentView === "Settings" && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#3b82f6] rounded-r-md" />
          )}
          <Settings
            className={`w-4 h-4 ${
              currentView === "Settings" ? "text-[#60a5fa]" : "text-[#7f98b3]"
            }`}
          />
          <span>Settings</span>
        </button>

        {/* Profile Pill */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#111c30] border border-[#1e2f4d]/60 hover:bg-[#15233c] transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0 shadow-inner ring-1 ring-white/20 overflow-hidden">
              <span className="tracking-tighter">UP</span>
            </div>
            <div className="min-w-0 text-left">
              <p className="text-xs font-semibold text-[#f8fafc] truncate">
                User profile
              </p>
              <p className="text-[11px] text-[#7f98b3] truncate">
                @sample.com
              </p>
            </div>
          </div>
          <button
            title="User options"
            className="p-1 text-[#7f98b3] hover:text-[#f8fafc] rounded hover:bg-[#1e2f4d]/50 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

