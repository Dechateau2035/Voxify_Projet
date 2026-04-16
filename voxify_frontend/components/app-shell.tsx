import type { ReactNode } from "react";
import { AppNavbar } from "@/components/app-navbar";

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <div className="min-h-dvh">
      <AppNavbar />
      <main className="mx-auto w-full min-w-0 max-w-7xl px-3 py-6 sm:px-4 sm:py-8">
        <header className="mb-6 rounded-[28px] border border-border/60 bg-card/60 p-5 shadow-[0_20px_80px_-40px_rgba(99,102,241,0.45)] backdrop-blur-xl sm:mb-8 sm:p-6">
          <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">{title}</h1>
          {subtitle ? (
            <p className="mt-2 max-w-3xl text-pretty text-sm text-muted-foreground sm:text-base">{subtitle}</p>
          ) : null}
        </header>
        {children}
      </main>
    </div>
  );
}
