"use client";

import { useEffect, useState } from "react";
import { AudioPlayer } from "@/components/audio-player";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchChantBySlug } from "@/lib/api/chants";
import type { Chant } from "@/lib/types";

type ChantDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default function ChantDetailPage(props: ChantDetailPageProps) {
  const [chant, setChant] = useState<Chant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const { slug } = await props.params;
        const data = await fetchChantBySlug(slug);
        if (active) setChant(data);
      } catch (err) {
        if (active) setError((err as Error).message);
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [props.params]);

  return (
    <AppShell
      title={chant?.title ?? "Detail du chant"}
      subtitle={chant?.category ? `Categorie: ${chant.category}` : "Chargement du chant..."}
    >
      {error ? <p className="text-destructive">{error}</p> : null}
      {loading || !chant ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          <section className="min-w-0 space-y-4 lg:col-span-2">
            <div className="flex min-h-44 h-[min(14rem,40vw)] items-center justify-center rounded-2xl bg-gradient-to-br from-primary/35 to-foreground/25 text-lg font-semibold sm:h-56 sm:min-h-56">
              {chant.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={chant.coverUrl} alt={chant.title} className="h-full w-full rounded-2xl object-cover" />
              ) : (
                "Cover"
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(chant.tags) ? chant.tags : []).map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
            <AudioPlayer src={chant.mainAudioUrl} label="Piste principale" />
            <div className="grid gap-3 md:grid-cols-2">
              <AudioPlayer src={chant.voiceTracks?.soprano} label="Soprano" />
              <AudioPlayer src={chant.voiceTracks?.alto} label="Alto" />
              <AudioPlayer src={chant.voiceTracks?.tenor} label="Tenor" />
              <AudioPlayer src={chant.voiceTracks?.bass} label="Bass" />
            </div>
          </section>
          <aside className="min-w-0 lg:min-h-0">
            <h3 className="mb-3 font-semibold">Lyrics</h3>
            <ScrollArea className="h-[min(24rem,calc(100dvh-14rem))] max-h-[70dvh] rounded-xl border border-border/60 p-3 sm:p-4">
              <p className="whitespace-pre-wrap break-words leading-relaxed text-sm text-muted-foreground">
                {chant.lyrics || "Aucune parole disponible."}
              </p>
            </ScrollArea>
          </aside>
        </div>
      )}
    </AppShell>
  );
}
