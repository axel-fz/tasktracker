"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { ITaskResponse } from "@/lib/validations/task";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  task: ITaskResponse | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteConfirmModal({
  isOpen,
  task,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !task) return null;

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => {
        if (!isDeleting) onClose();
      }}
    >
      <div
        className="w-full max-w-md bg-[#111c30] border border-[#2d1b28] rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-950/80 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3
                  id="delete-dialog-title"
                  className="text-base font-bold text-[#f8fafc]"
                >
                  Delete Task
                </h3>
                <p className="text-xs text-[#7f98b3] mt-0.5">
                  Are you sure you want to permanently delete this task?
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="text-[#7f98b3] hover:text-[#f8fafc] p-1 rounded-lg hover:bg-[#1a2742] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 p-3 bg-[#0d1627] rounded-lg border border-[#1e2f4e]/80">
            <p className="text-xs font-semibold text-[#f8fafc] truncate">
              {task.title}
            </p>
            {task.description && (
              <p className="text-[11px] text-[#7f98b3] truncate mt-0.5">
                {task.description}
              </p>
            )}
          </div>

          <p className="text-xs text-[#8c9fb6] mt-3">
            This action cannot be undone. The task will be removed from your database.
          </p>

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-xs font-semibold text-[#7f98b3] hover:text-[#f8fafc] hover:bg-[#1a2742] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isDeleting}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-red-600/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Delete Permanently</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

