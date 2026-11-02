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

const PALETTE_SWATCHES = [
  { name: "Primrose Cream", hex: "#ececa3" },
  { name: "Lime Chartreuse", hex: "#b5e550" },
  { name: "Citron Moss", hex: "#abc32f" },
  { name: "Deep Olive", hex: "#809c13" },
  { name: "Forest Sage", hex: "#607c3c" },
];

export default function SettingsView() {
  const { theme, setTheme, toggleTheme } = useTheme();

  const handleToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    toggleTheme();
    toast.success(
      nextTheme === "light"
        ? "Switched to Primrose & Linen Mode (Light)"
        : "Switched to Botanical Deep Olive Mode (Dark)"
    );
  };

  const handleSelect = (selectedTheme: "dark" | "light") => {
    if (theme === selectedTheme) return;
    setTheme(selectedTheme);
    toast.success(
      selectedTheme === "light"
        ? "Switched to Primrose & Linen Mode (Light)"
        : "Switched to Botanical Deep Olive Mode (Dark)"
    );
  };

  const isLight = theme === "light";

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-[#1e2f4e]/80">
        <h1 className="text-xl font-bold tracking-tight text-[#f8fafc] flex items-center gap-2.5">
          <Palette className="w-5 h-5 text-[#b5e550]" />
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
                Botanical Lime & Olive Theme
              </h2>
              <span
                className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border transition-colors ${
                  isLight
                    ? "bg-[#edf3e3] text-[#526f0c] border-[#dbe4cd]"
                    : "bg-[#27371c] text-[#b5e550] border-[#b5e550]/30"
                }`}
              >
                {isLight ? "Primrose Linen Active" : "Botanical Olive Active"}
              </span>
            </div>
            <p className="text-xs text-[#7f98b3] mt-1">
              Toggle between Botanical Deep Olive and Primrose Linen instantly
            </p>
          </div>

          {/* Interactive Toggle Button */}
          <button
            type="button"
            role="switch"
            aria-checked={isLight}
            onClick={handleToggle}
            className={`relative inline-flex h-10 w-24 shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#b5e550] focus:ring-offset-2 ${
              isLight
                ? "bg-gradient-to-r from-[#809c13] to-[#607c3c] focus:ring-offset-white"
                : "bg-[#11170c] border border-[#2e3e22] focus:ring-offset-[#182212]"
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
                <Sun className="h-4 w-4 text-[#809c13]" />
              ) : (
                <Moon className="h-4 w-4 text-[#607c3c]" />
              )}
            </span>

            {/* Label inside toggle */}
            <span
              className={`absolute text-[11px] font-semibold tracking-wider select-none uppercase ${
                isLight ? "left-3 text-white" : "right-3 text-[#94a888]"
              }`}
            >
              {isLight ? "Light" : "Dark"}
            </span>
          </button>
        </div>

        {/* Botanical Swatch Preview Ribbon */}
        <div className="p-4 rounded-xl bg-[#0d1627] border border-[#1e2f4e] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#b5e550]" />
            <div>
              <span className="text-xs font-bold text-[#f8fafc] block">
                Botanical Gradient Palette
              </span>
              <span className="text-[11px] text-[#7f98b3]">
                Primrose Cream → Lime Chartreuse → Citron Moss → Deep Olive → Forest Sage
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {PALETTE_SWATCHES.map((swatch) => (
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
            {/* Dark Mode Card: Botanical Deep Olive */}
            <div
              onClick={() => handleSelect("dark")}
              className={`cursor-pointer rounded-xl border p-4 transition-all duration-150 flex flex-col justify-between ${
                !isLight
                  ? "bg-[#11170c] border-[#b5e550] ring-2 ring-[#b5e550]/20 shadow-md"
                  : "bg-[#11170c]/80 border-[#2e3e22] hover:border-[#475f34]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#27371c] border border-[#b5e550]/30 flex items-center justify-center text-[#b5e550]">
                      <Moon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Botanical Deep Olive
                      </h3>
                      <p className="text-[11px] text-[#94a888]">
                        Organic deep forest olive with lime accents
                      </p>
                    </div>
                  </div>
                  {!isLight ? (
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#b5e550] to-[#abc32f] flex items-center justify-center text-[#0f160b]">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-[#2e3e22]" />
                  )}
                </div>

                {/* Mini UI Preview Representation */}
                <div className="mt-3 p-2.5 rounded-lg bg-[#11170c] border border-[#2e3e22] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-2 rounded bg-[#29381e]" />
                    <div className="w-8 h-2 rounded bg-[#b5e550]/60" />
                  </div>
                  <div className="p-2 rounded bg-[#182212] border border-[#2e3e22] flex items-center justify-between">
                    <div className="w-20 h-1.5 rounded bg-[#94a888]" />
                    <div className="w-6 h-1.5 rounded bg-[#b5e550]" />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#2e3e22] flex items-center justify-between text-xs text-[#94a888]">
                <span>Earthy Dark Palette</span>
                {!isLight && (
                  <span className="text-[#b5e550] font-medium">Selected</span>
                )}
              </div>
            </div>

            {/* White / Light Mode Card: Primrose & Linen */}
            <div
              onClick={() => handleSelect("light")}
              className={`cursor-pointer rounded-xl border p-4 transition-all duration-150 flex flex-col justify-between ${
                isLight
                  ? "bg-white border-[#809c13] ring-2 ring-[#809c13]/20 shadow-md text-[#18220f]"
                  : "bg-white/95 border-slate-300 hover:border-slate-400 text-slate-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#edf3e3] border border-[#dbe4cd] flex items-center justify-center text-[#607c3c]">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#18220f]">
                        Primrose & Linen
                      </h3>
                      <p className="text-[11px] text-[#5f7052]">
                        Crisp warm linen with olive & citron
                      </p>
                    </div>
                  </div>
                  {isLight ? (
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#809c13] to-[#607c3c] flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-300" />
                  )}
                </div>

                {/* Mini UI Preview Representation */}
                <div className="mt-3 p-2.5 rounded-lg bg-[#fbfbf6] border border-[#dbe4cd] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-2 rounded bg-slate-300" />
                    <div className="w-8 h-2 rounded bg-[#b5e550]/60" />
                  </div>
                  <div className="p-2 rounded bg-white border border-[#dbe4cd] flex items-center justify-between shadow-xs">
                    <div className="w-20 h-1.5 rounded bg-slate-400" />
                    <div className="w-6 h-1.5 rounded bg-[#809c13]" />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#dbe4cd] flex items-center justify-between text-xs text-[#5f7052]">
                <span>Clean Linen Aesthetic</span>
                {isLight && (
                  <span className="text-[#809c13] font-medium">Selected</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preference Persistence Notice */}
        <div className="flex items-center gap-2 pt-2 text-xs text-[#7f98b3]">
          <Monitor className="w-4 h-4 text-[#b5e550] shrink-0" />
          <span>
            Your theme preference is automatically remembered and restored whenever you visit.
          </span>
        </div>
      </div>

      {/* Secondary Card: Database & System Environment Status */}
      <div className="rounded-xl border border-[#1e2f4e]/80 bg-[#131e33] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#b5e550]/10 border border-[#b5e550]/30 flex items-center justify-center text-[#b5e550]">
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#182a15] border border-[#b5e550]/30 text-[#b5e550] text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b5e550] animate-pulse" />
            Connected
          </span>
        </div>

        <div className="flex items-center gap-2 pt-1 text-[11px] text-[#7f98b3]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#b5e550]" />
          <span>Remote TLS encrypted replication active</span>
        </div>
      </div>
    </div>
  );
}
