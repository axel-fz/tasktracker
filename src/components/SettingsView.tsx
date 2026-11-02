"use client";

import React from "react";
import { toast } from "sonner";
import {
  Moon,
  Sun,
  Check,
  Database,
  ShieldCheck,
  Palette,
  Monitor,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsView() {
  const { theme, setTheme, toggleTheme } = useTheme();

  const handleToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    toggleTheme();
    toast.success(
      nextTheme === "light"
        ? "Switched to White / Light Mode"
        : "Switched to Dark Navy Mode"
    );
  };

  const handleSelect = (selectedTheme: "dark" | "light") => {
    if (theme === selectedTheme) return;
    setTheme(selectedTheme);
    toast.success(
      selectedTheme === "light"
        ? "Switched to White / Light Mode"
        : "Switched to Dark Navy Mode"
    );
  };

  const isLight = theme === "light";

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-[#1e2f4e]/80">
        <h1 className="text-xl font-bold tracking-tight text-[#f8fafc] flex items-center gap-2.5">
          <Palette className="w-5 h-5 text-blue-400" />
          Settings & Preferences
        </h1>
        <p className="text-xs text-[#7f98b3] mt-1">
          Customize your dashboard appearance, display modes, and system options
        </p>
      </div>

      {/* Main Card: Appearance & Theme Toggle */}
      <div className="rounded-xl border border-[#1e2f4e]/80 bg-[#131e33] p-6 space-y-6 shadow-sm">
        {/* Section Title & Quick Toggle Switch */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1e2f4e]/60">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-[#f8fafc]">
                Interface Theme
              </h2>
              <span
                className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border transition-colors ${
                  isLight
                    ? "bg-amber-100 text-amber-800 border-amber-300"
                    : "bg-blue-950/60 text-blue-400 border-blue-500/30"
                }`}
              >
                {isLight ? "White Mode Active" : "Dark Navy Active"}
              </span>
            </div>
            <p className="text-xs text-[#7f98b3] mt-1">
              Toggle between Dark Navy and White / Light mode instantly
            </p>
          </div>

          {/* Interactive Toggle Button */}
          <button
            type="button"
            role="switch"
            aria-checked={isLight}
            onClick={handleToggle}
            className={`relative inline-flex h-10 w-24 shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isLight
                ? "bg-blue-600 focus:ring-offset-white"
                : "bg-[#0b111e] border border-[#25395c] focus:ring-offset-[#131e33]"
            }`}
          >
            <span className="sr-only">Toggle theme</span>
            
            {/* Sliding Thumb */}
            <span
              className={`pointer-events-none flex h-8 w-8 transform items-center justify-center rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                isLight ? "translate-x-14" : "translate-x-0"
              }`}
            >
              {isLight ? (
                <Sun className="h-4 w-4 text-amber-500" />
              ) : (
                <Moon className="h-4 w-4 text-blue-900" />
              )}
            </span>

            {/* Label inside toggle */}
            <span
              className={`absolute text-[11px] font-semibold tracking-wider select-none uppercase ${
                isLight ? "left-3 text-white" : "right-3 text-[#7f98b3]"
              }`}
            >
              {isLight ? "Light" : "Dark"}
            </span>
          </button>
        </div>

        {/* Side-by-side Visual Theme Selection Cards */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#7f98b3] block mb-3">
            Choose Preferred Mode
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dark Mode Card */}
            <div
              onClick={() => handleSelect("dark")}
              className={`cursor-pointer rounded-xl border p-4 transition-all duration-150 flex flex-col justify-between ${
                !isLight
                  ? "bg-[#0f172a] border-blue-500 ring-2 ring-blue-500/20 shadow-md"
                  : "bg-[#0f172a]/70 border-[#1e2f4e]/80 hover:border-[#38517e]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Moon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Dark Navy Mode
                      </h3>
                      <p className="text-[11px] text-[#7f98b3]">
                        Deep dark navy aesthetic
                      </p>
                    </div>
                  </div>
                  {!isLight ? (
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-[#2b4169]" />
                  )}
                </div>

                {/* Mini UI Preview Representation */}
                <div className="mt-3 p-2.5 rounded-lg bg-[#0b111e] border border-[#1e2f4e] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-2 rounded bg-[#1e2f4e]" />
                    <div className="w-8 h-2 rounded bg-blue-500/40" />
                  </div>
                  <div className="p-2 rounded bg-[#131e33] border border-[#1e2f4e]/60 flex items-center justify-between">
                    <div className="w-20 h-1.5 rounded bg-[#627d98]" />
                    <div className="w-6 h-1.5 rounded bg-emerald-500/50" />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1e2f4e]/60 flex items-center justify-between text-xs text-[#7f98b3]">
                <span>Default Dashboard Palette</span>
                {!isLight && (
                  <span className="text-blue-400 font-medium">Selected</span>
                )}
              </div>
            </div>

            {/* White / Light Mode Card */}
            <div
              onClick={() => handleSelect("light")}
              className={`cursor-pointer rounded-xl border p-4 transition-all duration-150 flex flex-col justify-between ${
                isLight
                  ? "bg-white border-blue-500 ring-2 ring-blue-500/20 shadow-md text-slate-900"
                  : "bg-white/95 border-[#1e2f4e]/80 hover:border-slate-300 text-slate-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        White / Light Mode
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Crisp clean bright aesthetic
                      </p>
                    </div>
                  </div>
                  {isLight ? (
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-300" />
                  )}
                </div>

                {/* Mini UI Preview Representation */}
                <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-2 rounded bg-slate-300" />
                    <div className="w-8 h-2 rounded bg-blue-200" />
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                    <div className="w-20 h-1.5 rounded bg-slate-400" />
                    <div className="w-6 h-1.5 rounded bg-emerald-300" />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>High-Contrast Light Palette</span>
                {isLight && (
                  <span className="text-blue-600 font-medium">Selected</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preference Persistence Notice */}
        <div className="flex items-center gap-2 pt-2 text-xs text-[#7f98b3]">
          <Monitor className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            Your theme preference is automatically remembered and restored whenever you visit.
          </span>
        </div>
      </div>

      {/* Secondary Card: Database & System Environment Status */}
      <div className="rounded-xl border border-[#1e2f4e]/80 bg-[#131e33] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#f8fafc]">
                MongoDB Atlas Cluster
              </h3>
              <p className="text-[11px] text-[#7f98b3]">
                Database: <span className="font-mono text-[#cad5e2]">tasktracker</span>
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Connected
          </span>
        </div>

        <div className="flex items-center gap-2 pt-1 text-[11px] text-[#7f98b3]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Remote TLS encrypted replication active</span>
        </div>
      </div>
    </div>
  );
}
