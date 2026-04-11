"use client";

import { ChantCard } from "@/components/chant-card";
import { AppShell } from "@/components/app-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { useChants } from "@/hooks/use-chants";

export default function DashboardPage() {
  const { chants, loading, error } = useChants();
  const popular = chants.slice(0, 4);
  const recent = chants.slice(0, 8);
  const categories = [...new Set(chants.map((c) => c.category))].slice(0, 5);

  return (
    <AppShell title="Dashboard" subtitle="Vos chants, organises comme une application SaaS premium.">
      {error ? <p className="mb-6 text-sm text-destructive">{error}</p> : null}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Populaires</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-60 rounded-2xl" />)
            : popular.map((chant) => <ChantCard key={chant.id} chant={chant} />)}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Recents</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-60 rounded-2xl" />)
            : recent.map((chant) => <ChantCard key={chant.id} chant={chant} />)}
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span key={category} className="rounded-full border border-border/60 px-3 py-1 text-sm">
              {category}
            </span>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
