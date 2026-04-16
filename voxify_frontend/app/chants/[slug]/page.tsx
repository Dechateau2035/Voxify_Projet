"use client";

import { useEffect, useState } from "react";
import { Disc3, Tags } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AudioPlayer } from "@/components/audio-player";
import { PDFViewer } from "@/components/pdf-viewer";
import { VoicesPlayer } from "@/components/voices-player";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getChantBySlug } from "@/lib/api";
import type { Chant } from "@/lib/types";

type ChantDetailPageProps = PageProps<"/chants/[slug]">;

export default function ChantDetailPage(props: ChantDetailPageProps) {
  const [chant, setChant] = useState<Chant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const { slug } = await props.params;
        const data = await getChantBySlug(slug);
        if (active) {
          setChant(data);
        }
      } catch (err) {
        if (active) {
          setError((err as Error).message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
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
      subtitle={chant?.category ? `Categorie : ${chant.category}` : "Ecoute, paroles et partition dans une seule vue."}
    >
      {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}

      {loading || !chant ? (
        <div className="rounded-[28px] border border-border/60 bg-card/60 p-6 text-muted-foreground">Chargement du chant...</div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6">
            <div className="overflow-hidden rounded-[32px] border border-border/60 bg-card/70">
              <div className="relative flex h-[280px] items-end bg-gradient-to-br from-primary/35 via-primary/15 to-sky-500/10">
                {chant.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={chant.coverUrl} alt={chant.title} className="absolute inset-0 h-full w-full object-cover opacity-80" />
                ) : null}
                <div className="relative z-10 w-full bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="rounded-full">
                      <Disc3 className="mr-1 size-3.5" />
                      {chant.category}
                    </Badge>
                    {chant.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="rounded-full border-white/20 bg-black/20 text-white">
                        <Tags className="mr-1 size-3.5" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h2 className="text-3xl font-semibold text-white">{chant.title}</h2>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">Audio principal</h3>
                <PDFViewer title={`Partition - ${chant.title}`} url={chant.sheetMusicUrl} />
              </div>
              <AudioPlayer src={chant.mainAudioUrl} label="Piste principale" />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Voix</h3>
              <VoicesPlayer voices={chant.voices} />
            </div>
          </section>

          <section className="space-y-4">
            <div className="rounded-[32px] border border-border/60 bg-card/70 p-5">
              <h3 className="mb-3 text-lg font-semibold">Paroles</h3>
              <ScrollArea className="h-[min(70vh,620px)] rounded-2xl border border-border/60 bg-background/40 p-4">
                <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                  {chant.lyrics || "Aucune parole disponible pour ce chant."}
                </p>
              </ScrollArea>
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
}
