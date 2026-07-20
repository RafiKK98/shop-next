"use client";

import { type ReactNode } from "react";
import { Toaster } from "sonner";
import { useTheme } from "./theme";

interface ToastProviderPorps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderPorps) {
  const { theme } = useTheme();

  return (
    <>
      {children}
      <Toaster
        theme={theme}
        richColors
        closeButton
        position="top-right"
        toastOptions={{
          duration: 4000,
        }}
      />
    </>
  );
}
