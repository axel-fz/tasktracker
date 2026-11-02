"use client";

import React from "react";
import {
  LayoutDashboard,
  CheckSquare,
  Folder,
  TrendingUp,
  Settings,
  MoreVertical,
  X,
} from "lucide-react";

interface SidebarProps {
  currentView?: string;
  onNavigate?: (view: string) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({
  currentView = "Dashboard",
  onNavigate,
  isMobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const mainNavItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Tasks", icon: CheckSquare },
    { label: "Categories", icon: Folder },
    { label: "Analytics", icon: TrendingUp },
  ];

  const handleNavClick = (label: string) => {
    if (onNavigate) onNavigate(label);
    if (onMobileClose) onMobileClose();
  };

  const renderNavContent = (isMobile = false) => (
    <div className="flex flex-col justify-between h-full">
      {/* Top Branding & Main Navigation */}
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#1e2f4d]/60">
          <span className="text-xl font-bold tracking-tight text-[#f8fafc]">
            Task Tracker
          </span>
          {isMobile && (
            <button
              type="button"
              onClick={onMobileClose}
              aria-label="Close menu"
              className="p-1.5 rounded-lg text-[#7f98b3] hover:text-[#f8fafc] hover:bg-[#131e33] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Primary Navigation Links */}
        <nav className="p-3 space-y-1 mt-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.label;

            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.label)}
                className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#16233d] text-[#60a5fa]"
                    : "text-[#7f98b3] hover:text-[#f8fafc] hover:bg-[#131e33]"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#3b82f6] rounded-r-md" />
                )}
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-[#60a5fa]" : "text-[#7f98b3]"
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Secondary Settings & Profile Pill */}
      <div className="p-3 space-y-3 border-t border-[#1e2f4d]/60">
        <button
          onClick={() => handleNavClick("Settings")}
          className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
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
            className="p-1 text-[#7f98b3] hover:text-[#f8fafc] rounded hover:bg-[#1e2f4d]/50 transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Permanent Left Sidebar (Hidden on screens < 1024px) */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col justify-between h-screen sticky top-0 bg-[#0d1527] border-r border-[#1e2f4d]/80 select-none z-30">
        {renderNavContent(false)}
      </aside>

      {/* 2. Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close navigation"
          onClick={onMobileClose}
          onKeyDown={(e) => {
            if (e.key === "Escape" && onMobileClose) onMobileClose();
          }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* 3. Mobile Sliding Drawer Sidebar (Appears on screens < 1024px when toggled) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 max-w-[85vw] z-50 flex flex-col justify-between h-screen bg-[#0d1527] border-r border-[#1e2f4d] shadow-2xl select-none transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
        }`}
      >
        {renderNavContent(true)}
      </aside>
    </>
  );
}
