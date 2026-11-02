import React from "react";

interface TaskSkeletonsProps {
  count?: number;
}

export default function TaskSkeletons({ count = 5 }: TaskSkeletonsProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-[#1e2f4e]/60 bg-[#131e33]/70 p-4 animate-pulse flex flex-col lg:flex-row lg:items-center justify-between gap-3"
        >
          {/* Left section: Checkbox + Title + Description skeleton */}
          <div className="flex items-center gap-3.5 flex-1">
            <div className="w-5 h-5 rounded bg-[#1e2f4e] flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-[#1e2f4e] rounded w-1/3" />
              <div className="h-3 bg-[#17253d] rounded w-2/3 hidden sm:block" />
            </div>
          </div>

          {/* Right section: Date, Status, Priority, Actions */}
          <div className="flex items-center gap-6 pt-2 lg:pt-0">
            <div className="space-y-1.5 min-w-[70px]">
              <div className="h-2.5 bg-[#17253d] rounded w-12" />
              <div className="h-3 bg-[#1e2f4e] rounded w-16" />
            </div>

            <div className="space-y-1.5 min-w-[75px]">
              <div className="h-2.5 bg-[#17253d] rounded w-10" />
              <div className="h-5 bg-[#1e2f4e] rounded-md w-16" />
            </div>

            <div className="space-y-1.5 min-w-[65px]">
              <div className="h-2.5 bg-[#17253d] rounded w-10" />
              <div className="h-5 bg-[#1e2f4e] rounded-md w-14" />
            </div>

            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 bg-[#1e2f4e] rounded-lg" />
              <div className="w-7 h-7 bg-[#1e2f4e] rounded-lg" />
              <div className="w-7 h-7 bg-[#1e2f4e] rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

