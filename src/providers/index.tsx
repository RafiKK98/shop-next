import { type ReactNode } from "react";
import { SessionProvider } from "./session";
import { ThemeProvider } from "./theme";
import { ToastProvider } from "./toast";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

export { ThemeScript, useTheme } from "./theme";
