"use client";

import { Input } from "@/components/ui/input";

type FilterPanelProps = {
  search: string;
  category: string;
  tag: string;
  categories: string[];
  tags: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTagChange: (value: string) => void;
};

export function FilterPanel({
  search,
  category,
  tag,
  categories,
  tags,
  onSearchChange,
  onCategoryChange,
  onTagChange,
}: FilterPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-2xl border border-border/60 bg-card/70 p-3 sm:p-4 md:grid-cols-3">
      <Input
        placeholder="Rechercher un chant..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="min-w-0"
      />
      <select
        title="Categories"
        className="h-10 min-w-0 w-full rounded-md border border-input bg-background px-3 text-sm"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">Toutes categories</option>
        {categories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <select
        title="Tags"
        className="h-10 min-w-0 w-full rounded-md border border-input bg-background px-3 text-sm"
        value={tag}
        onChange={(e) => onTagChange(e.target.value)}
      >
        <option value="">Tous tags</option>
        {tags.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}
