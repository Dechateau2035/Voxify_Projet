"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ChantCard } from "@/components/chant-card";
import { FilterPanel } from "@/components/filter-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useChants } from "@/hooks/use-chants";

const PAGE_SIZE = 8;

export default function ChantsPage() {
  const { chants, loading, error } = useChants();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => [...new Set(chants.map((c) => c.category))], [chants]);
  const tags = useMemo(() => [...new Set(chants.flatMap((c) => c.tags ?? []))], [chants]);

  const filtered = useMemo(() => {
    return chants.filter((chant) => {
      const matchesSearch = chant.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !category || chant.category === category;
      const matchesTag = !tag || chant.tags?.includes(tag);
      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [chants, search, category, tag]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  return (
    <AppShell title="Bibliotheque des chants" subtitle="Filtrez, recherchez et explorez rapidement.">
      {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Link href="/chants/new" className="w-full sm:w-auto sm:shrink-0">
          <Button className="w-full sm:w-auto">Ajouter un chant</Button>
        </Link>
      </div>
      <div className="mb-6">
        <FilterPanel
          search={search}
          category={category}
          tag={tag}
          categories={categories}
          tags={tags}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onTagChange={setTag}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-60 rounded-2xl" />)
          : paginated.map((chant) => <ChantCard key={chant.id} chant={chant} />)}
      </div>
      {!loading && hasMore ? (
        <div className="mt-8 flex justify-center">
          <button
            className="rounded-md border border-border/60 bg-secondary px-4 py-2 text-sm"
            onClick={() => setPage((p) => p + 1)}
          >
            Charger plus
          </button>
        </div>
      ) : null}
    </AppShell>
  );
}
