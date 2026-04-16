"use client";

import { ListFilter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    <div className="grid grid-cols-1 gap-3 rounded-[28px] border border-border/60 bg-card/70 p-4 backdrop-blur md:grid-cols-[1.4fr_1fr_1fr]">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher un chant..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="min-w-0 rounded-full pl-9"
        />
      </div>
      <Select
        value={category || "__all__"}
        onValueChange={(value) => onCategoryChange(!value || value === "__all__" ? "" : value)}
      >
        <SelectTrigger className="h-10 w-full rounded-full px-4">
          <ListFilter className="size-4 text-muted-foreground" />
          <SelectValue placeholder="Toutes categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Toutes categories</SelectItem>
          {categories.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={tag || "__all__"} onValueChange={(value) => onTagChange(!value || value === "__all__" ? "" : value)}>
        <SelectTrigger className="h-10 w-full rounded-full px-4">
          <ListFilter className="size-4 text-muted-foreground" />
          <SelectValue placeholder="Tous tags" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Tous tags</SelectItem>
          {tags.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
