"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ChantCard } from "@/components/chant-card";
import { FilterPanel } from "@/components/filter-panel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useChants } from "@/hooks/use-chants";

const PAGE_SIZE = 9;

export default function ChantsPage() {
  const { chants, loading, error } = useChants();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => [...new Set(chants.map((chant) => chant.category).filter(Boolean))], [chants]);
  const tags = useMemo(() => [...new Set(chants.flatMap((chant) => chant.tags ?? []).filter(Boolean))], [chants]);

  const filtered = useMemo(() => {
    return chants.filter((chant) => {
      const matchesSearch =
        !search ||
        chant.title.toLowerCase().includes(search.toLowerCase()) ||
        chant.tags.some((item) => item.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = !category || chant.category === category;
      const matchesTag = !tag || chant.tags.includes(tag);
      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [category, chants, search, tag]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  return (
    <AppShell
      title="Bibliotheque des chants"
      subtitle="Explore rapidement les chants de la chorale avec une grille moderne, un filtrage simple et une navigation fluide."
    >
      {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}

      <div className="mb-6">
        <FilterPanel
          search={search}
          category={category}
          tag={tag}
          categories={categories}
          tags={tags}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          onCategoryChange={(value) => {
            setCategory(value);
            setPage(1);
          }}
          onTagChange={(value) => {
            setTag(value);
            setPage(1);
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 9 }).map((_, index) => <Skeleton key={index} className="h-72 rounded-[28px]" />)
          : paginated.map((chant) => <ChantCard key={chant.id} chant={chant} />)}
      </div>

      {!loading && hasMore ? (
        <div className="mt-8 flex justify-center">
          <Button variant="secondary" className="rounded-full" onClick={() => setPage((current) => current + 1)}>
            Charger plus
          </Button>
        </div>
      ) : null}
    </AppShell>
  );
}
