"use client";

import { AppShell } from "@/components/app-shell";
import { ChantCard } from "@/components/chant-card";
import { useChants } from "@/hooks/use-chants";
import { useFavoritesStore } from "@/store/favorites-store";

export default function FavoritesPage() {
  const { chants } = useChants();
  const { favorites } = useFavoritesStore();
  const data = chants.filter((chant) => favorites.includes(chant.id));

  return (
    <AppShell title="Favoris" subtitle="Votre selection personnelle, style Spotify.">
      {data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground sm:p-10 sm:text-base">
          Aucun favori pour le moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {data.map((chant) => (
            <ChantCard key={chant.id} chant={chant} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
