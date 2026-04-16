"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ChantForm } from "@/components/chant-form";
import { getChantById } from "@/lib/api";
import type { Chant } from "@/lib/types";

type EditChantPageProps = PageProps<"/admin/chants/[id]/edit">;

export default function EditChantPage(props: EditChantPageProps) {
  const [chant, setChant] = useState<Chant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const { id } = await props.params;
        const data = await getChantById(id);
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
    <AppShell title="Modifier un chant" subtitle="Remplace les fichiers existants et ajuste les metadonnees du chant.">
      {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}
      {loading || !chant ? (
        <div className="rounded-[28px] border border-border/60 bg-card/60 p-6 text-muted-foreground">Chargement du chant...</div>
      ) : (
        <ChantForm mode="edit" initialChant={chant} />
      )}
    </AppShell>
  );
}
