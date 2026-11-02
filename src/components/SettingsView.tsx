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
  Sparkles,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const SPECTRAL_SWATCHES = [
  { name: "Midnight Plum", hex: "#461336" },
  { name: "Crimson Rose", hex: "#b23255" },
  { name: "Sunset Coral", hex: "#ff5249" },
  { name: "Warm Tangerine", hex: "#fd7249" },
  { name: "Golden Amber", hex: "#fe9346" },
];

export default function SettingsView() {
  const { theme, setTheme, toggleTheme } = useTheme();

  const handleToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    toggleTheme();
    toast.success(
      nextTheme === "light"
        ? "Switched to Spectral Warm Porcelain (Light)"
        : "Switched to Spectral Midnight Plum (Dark)"
    );
  };

  const handleSelect = (selectedTheme: "dark" | "light") => {
    if (theme === selectedTheme) return;
    setTheme(selectedTheme);
    toast.success(
      selectedTheme === "light"
        ? "Switched to Spectral Warm Porcelain (Light)"
        : "Switched to Spectral Midnight Plum (Dark)"
    );
  };

  const isLight = theme === "light";

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-[#1e2f4e]/80">
        <h1 className="text-xl font-bold tracking-tight text-[#f8fafc] flex items-center gap-2.5">
          <Palette className="w-5 h-5 text-[#ff5249]" />
          Settings & Preferences
        </h1>
        <p className="text-xs text-[#7f98b3] mt-1">
          Customize your dashboard appearance, display modes, and color system
        </p>
      </div>

      {/* Main Card: Appearance & Theme Toggle */}
      <div className="rounded-xl border border-[#1e2f4e]/80 bg-[#131e33] p-6 space-y-6 shadow-sm">
        {/* Section Title & Quick Toggle Switch */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1e2f4e]/60">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-[#f8fafc]">
                Spectral Color System
              </h2>
              <span
                className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border transition-colors ${
                  isLight
                    ? "bg-[#fff1f4] text-[#b23255] border-[#fecdd8]"
                    : "bg-[#38132d] text-[#ff726b] border-[#ff5249]/30"
                }`}
              >
                {isLight ? "Warm Porcelain Active" : "Midnight Plum Active"}
              </span>
            </div>
            <p className="text-xs text-[#7f98b3] mt-1">
              Toggle between Spectral Midnight Plum and Warm Porcelain instantly
            </p>
          </div>

          {/* Interactive Toggle Button */}
          <button
            type="button"
            role="switch"
            aria-checked={isLight}
            onClick={handleToggle}
            className={`relative inline-flex h-10 w-24 shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#ff5249] focus:ring-offset-2 ${
              isLight
                ? "bg-gradient-to-r from-[#ff5249] to-[#fd7249] focus:ring-offset-white"
                : "bg-[#180614] border border-[#47183a] focus:ring-offset-[#230c1d]"
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
                <Sun className="h-4 w-4 text-[#fe9346]" />
              ) : (
                <Moon className="h-4 w-4 text-[#461336]" />
              )}
            </span>

            {/* Label inside toggle */}
            <span
              className={`absolute text-[11px] font-semibold tracking-wider select-none uppercase ${
                isLight ? "left-3 text-white" : "right-3 text-[#b295a6]"
              }`}
            >
              {isLight ? "Light" : "Dark"}
            </span>
          </button>
        </div>

        {/* Spectral Swatch Preview Ribbon */}
        <div className="p-4 rounded-xl bg-[#0d1627] border border-[#1e2f4e] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#fe9346]" />
            <div>
              <span className="text-xs font-bold text-[#f8fafc] block">
                Spectral Gradient Palette
              </span>
              <span className="text-[11px] text-[#7f98b3]">
                Midnight Plum → Crimson → Sunset Coral → Tangerine → Amber
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {SPECTRAL_SWATCHES.map((swatch) => (
              <div
                key={swatch.name}
                title={`${swatch.name} (${swatch.hex})`}
                style={{ backgroundColor: swatch.hex }}
                className="w-6 h-6 rounded-md shadow-xs border border-white/10"
              />
            ))}
          </div>
        </div>

        {/* Side-by-side Visual Theme Selection Cards */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#7f98b3] block mb-3">
            Choose Preferred Mode
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dark Mode Card: Spectral Midnight Plum */}
            <div
              onClick={() => handleSelect("dark")}
              className={`cursor-pointer rounded-xl border p-4 transition-all duration-150 flex flex-col justify-between ${
                !isLight
                  ? "bg-[#180614] border-[#ff5249] ring-2 ring-[#ff5249]/20 shadow-md"
                  : "bg-[#180614]/80 border-[#47183a] hover:border-[#6b2658]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#38132d] border border-[#ff5249]/30 flex items-center justify-center text-[#ff726b]">
                      <Moon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Spectral Midnight Plum
                      </h3>
                      <p className="text-[11px] text-[#b295a6]">
                        Deep dark plum velvet with sunset coral
                      </p>
                    </div>
                  </div>
                  {!isLight ? (
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#ff5249] to-[#fd7249] flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-[#47183a]" />
                  )}
                </div>

                {/* Mini UI Preview Representation */}
                <div className="mt-3 p-2.5 rounded-lg bg-[#180614] border border-[#47183a] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-2 rounded bg-[#3b1430]" />
                    <div className="w-8 h-2 rounded bg-[#ff5249]/60" />
                  </div>
                  <div className="p-2 rounded bg-[#230c1d] border border-[#47183a] flex items-center justify-between">
                    <div className="w-20 h-1.5 rounded bg-[#b295a6]" />
                    <div className="w-6 h-1.5 rounded bg-[#10b981]" />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#47183a] flex items-center justify-between text-xs text-[#b295a6]">
                <span>Rich Dark Aesthetic</span>
                {!isLight && (
                  <span className="text-[#ff726b] font-medium">Selected</span>
                )}
              </div>
            </div>

            {/* White / Light Mode Card: Spectral Warm Porcelain */}
            <div
              onClick={() => handleSelect("light")}
              className={`cursor-pointer rounded-xl border p-4 transition-all duration-150 flex flex-col justify-between ${
                isLight
                  ? "bg-white border-[#ff5249] ring-2 ring-[#ff5249]/20 shadow-md text-[#230b1c]"
                  : "bg-white/95 border-slate-300 hover:border-slate-400 text-slate-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#fff1f4] border border-[#fecdd8] flex items-center justify-center text-[#b23255]">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#230b1c]">
                        Spectral Warm Porcelain
                      </h3>
                      <p className="text-[11px] text-[#7e6574]">
                        Crisp warm white with sunset accents
                      </p>
                    </div>
                  </div>
                  {isLight ? (
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#ff5249] to-[#fd7249] flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-300" />
                  )}
                </div>

                {/* Mini UI Preview Representation */}
                <div className="mt-3 p-2.5 rounded-lg bg-[#faf7f9] border border-[#ebdce5] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-2 rounded bg-slate-300" />
                    <div className="w-8 h-2 rounded bg-[#ff5249]/40" />
                  </div>
                  <div className="p-2 rounded bg-white border border-[#ebdce5] flex items-center justify-between shadow-xs">
                    <div className="w-20 h-1.5 rounded bg-slate-400" />
                    <div className="w-6 h-1.5 rounded bg-[#10b981]" />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#ebdce5] flex items-center justify-between text-xs text-[#7e6574]">
                <span>High-Contrast Light Aesthetic</span>
                {isLight && (
                  <span className="text-[#b23255] font-medium">Selected</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preference Persistence Notice */}
        <div className="flex items-center gap-2 pt-2 text-xs text-[#7f98b3]">
          <Monitor className="w-4 h-4 text-[#ff5249] shrink-0" />
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
