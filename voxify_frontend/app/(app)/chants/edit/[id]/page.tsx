"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ChantForm } from "@/components/chant-form";
import { fetchChantById } from "@/lib/api/chants";
import type { Chant } from "@/lib/types";

type EditChantPageProps = {
  params: Promise<{ id: string }>;
};

export default function EditChantPage(props: EditChantPageProps) {
  const [chant, setChant] = useState<Chant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const { id } = await props.params;
        const data = await fetchChantById(id);
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
    <AppShell title="Modifier un chant" subtitle="Mettez a jour les metadonnees et les fichiers.">
      {error ? <p className="text-destructive">{error}</p> : null}
      {loading ? <p className="text-muted-foreground">Chargement...</p> : null}
      {!loading && chant ? <ChantForm mode="edit" initialChant={chant} /> : null}
    </AppShell>
  );
}
