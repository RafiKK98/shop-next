"use client";

import { Toaster } from "sonner";
import { useTheme } from "./theme";

export function ToastProvider({ children }: { children: React.ReactNode }) {
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
