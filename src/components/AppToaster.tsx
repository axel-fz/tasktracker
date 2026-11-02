"use client";

import React from "react";
import { Toaster } from "sonner";
import { useTheme } from "@/context/ThemeContext";

export default function AppToaster() {
  const { theme } = useTheme();

  return (
    <Toaster
      position="bottom-right"
      theme={theme}
      closeButton
      richColors
    />
  );
}
