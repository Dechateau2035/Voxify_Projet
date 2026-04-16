"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Upload } from "lucide-react";
import { createChant, updateChant } from "@/lib/api";
import type { Chant } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type ChantFormProps = {
  mode: "create" | "edit";
  initialChant?: Chant;
};

export function ChantForm({ mode, initialChant }: ChantFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialChant?.title ?? "");
  const [category, setCategory] = useState(initialChant?.category ?? "");
  const [lyrics, setLyrics] = useState(initialChant?.lyrics ?? "");
  const [tags, setTags] = useState((initialChant?.tags ?? []).join(", "));
  const [isPublished, setIsPublished] = useState(Boolean(initialChant?.isPublished));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [sheetMusic, setSheetMusic] = useState<File | null>(null);
  const [voices, setVoices] = useState<Array<{ id: string; name: string; file: File | null }>>(
    initialChant?.voices?.length
      ? initialChant.voices.map((voice, index) => ({
          id: `${voice.id}-${index}`,
          name: voice.name,
          file: null,
        }))
      : [
          { id: "soprano-0", name: "Soprano", file: null },
          { id: "alto-1", name: "Alto", file: null },
          { id: "tenor-2", name: "Tenor", file: null },
          { id: "bass-3", name: "Bass", file: null },
        ],
  );

  const existingFiles = useMemo(
    () => ({
      cover: initialChant?.coverUrl,
      audio: initialChant?.mainAudioUrl,
      sheetMusic: initialChant?.sheetMusicUrl,
    }),
    [initialChant],
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) {
      setError("Le titre est obligatoire.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const payload = {
        title: title.trim(),
        category: category.trim(),
        lyrics,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        isPublished,
      };

      const files = {
        coverImage,
        audio,
        sheetMusic,
        voices,
      };

      if (mode === "create") {
        await createChant(payload, files);
      } else if (initialChant?.id) {
        await updateChant(initialChant.id, payload, files);
      }

      router.push("/admin/chants");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="min-w-0 rounded-[32px] border-border/60 bg-card/75 backdrop-blur">
      <CardHeader>
        <CardTitle>{mode === "create" ? "Creer un chant" : "Modifier le chant"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Titre</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Ave Maria" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Categorie</label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ex: Liturgie" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="chorale, paques, classique" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Paroles</label>
            <textarea
              className="min-h-48 w-full min-w-0 rounded-3xl border border-input bg-background px-4 py-3 text-sm"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Collez ici les paroles du chant..."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cover</label>
              <Input type="file" accept="image/*" className="min-w-0" onChange={(e) => setCoverImage(e.target.files?.[0] ?? null)} />
              {existingFiles.cover ? <p className="text-xs text-muted-foreground">Cover existante detectee.</p> : null}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Audio principal</label>
              <Input type="file" accept="audio/*" className="min-w-0" onChange={(e) => setAudio(e.target.files?.[0] ?? null)} />
              {existingFiles.audio ? <p className="text-xs text-muted-foreground">Audio principal deja present.</p> : null}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Partition PDF</label>
              <Input
                type="file"
                accept="application/pdf"
                className="min-w-0"
                onChange={(e) => setSheetMusic(e.target.files?.[0] ?? null)}
              />
              {existingFiles.sheetMusic ? <p className="text-xs text-muted-foreground">Partition deja presente.</p> : null}
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-border/60 bg-background/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-medium">Voix</h3>
                <p className="text-sm text-muted-foreground">Ajoute une piste audio par voix.</p>
              </div>
              <Button
                type="button"
                variant="secondary"
                className="rounded-full"
                onClick={() =>
                  setVoices((current) => [
                    ...current,
                    { id: `voice-${Date.now()}`, name: `Voix ${current.length + 1}`, file: null },
                  ])
                }
              >
                <Plus className="size-4" />
                Ajouter une voix
              </Button>
            </div>

            <div className="space-y-3">
              {voices.map((voice) => (
                <div key={voice.id} className="grid gap-3 rounded-2xl border border-border/60 bg-card/60 p-4 md:grid-cols-[1fr_1.4fr_auto]">
                  <Input
                    value={voice.name}
                    onChange={(event) =>
                      setVoices((current) =>
                        current.map((item) => (item.id === voice.id ? { ...item, name: event.target.value } : item)),
                      )
                    }
                    placeholder="Nom de la voix"
                  />
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={(event) =>
                      setVoices((current) =>
                        current.map((item) =>
                          item.id === voice.id ? { ...item, file: event.target.files?.[0] ?? null } : item,
                        ),
                      )
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setVoices((current) => current.filter((item) => item.id !== voice.id))}
                    disabled={voices.length === 1}
                    aria-label={`Retirer ${voice.name}`}
                  >
                    <Minus className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/40 px-4 py-3 text-sm">
            <Upload className="size-4 text-primary" />
            <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
            Publier ce chant dans la bibliotheque
          </label>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="submit" disabled={loading} className="w-full rounded-full sm:w-auto">
              {loading ? "Envoi..." : mode === "create" ? "Creer le chant" : "Enregistrer"}
            </Button>
            <Button type="button" variant="ghost" className="w-full rounded-full sm:w-auto" onClick={() => router.push("/admin/chants")}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
