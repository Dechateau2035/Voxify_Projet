"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createChant, updateChant } from "@/lib/api/chants";
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
  const [audioUrl, setAudioUrl] = useState<File | null>(null);
  const [soprano, setSoprano] = useState<File | null>(null);
  const [alto, setAlto] = useState<File | null>(null);
  const [tenor, setTenor] = useState<File | null>(null);
  const [bass, setBass] = useState<File | null>(null);

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
        audioUrl,
        voices: { soprano, alto, tenor, bass },
      };

      if (mode === "create") {
        await createChant(payload, files);
      } else if (initialChant?.id) {
        await updateChant(initialChant.id, payload, files);
      }

      router.push("/chants");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="min-w-0 border-border/60 bg-card/75">
      <CardHeader>
        <CardTitle>{mode === "create" ? "Ajouter un chant" : "Modifier le chant"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre" />
          <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Categorie" />
          <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (separes par virgule)" />
          <textarea
            className="min-h-36 w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="Paroles"
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
            Publie
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input type="file" accept="image/*" className="min-w-0" onChange={(e) => setCoverImage(e.target.files?.[0] ?? null)} />
            <Input type="file" accept="audio/*" className="min-w-0" onChange={(e) => setAudioUrl(e.target.files?.[0] ?? null)} />
            <Input type="file" accept="audio/*" className="min-w-0" onChange={(e) => setSoprano(e.target.files?.[0] ?? null)} />
            <Input type="file" accept="audio/*" className="min-w-0" onChange={(e) => setAlto(e.target.files?.[0] ?? null)} />
            <Input type="file" accept="audio/*" className="min-w-0" onChange={(e) => setTenor(e.target.files?.[0] ?? null)} />
            <Input type="file" accept="audio/*" className="min-w-0" onChange={(e) => setBass(e.target.files?.[0] ?? null)} />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? "Envoi..." : mode === "create" ? "Creer le chant" : "Enregistrer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
