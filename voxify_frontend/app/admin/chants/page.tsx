"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ChantCard } from "@/components/chant-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteChant } from "@/lib/api";
import { useChants } from "@/hooks/use-chants";

export default function AdminChantsPage() {
  const { chants, loading, error } = useChants();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const sortedChants = useMemo(
    () =>
      [...chants]
        .filter((chant) => !deletedIds.includes(chant.id))
        .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? "")),
    [chants, deletedIds],
  );

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Supprimer ce chant ?");
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteChant(id);
      setDeletedIds((current) => [...current, id]);
    } catch (err) {
      window.alert((err as Error).message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AppShell
      title="Administration des chants"
      subtitle="Page non publique pour tester la creation, la modification et la suppression des chants."
    >
      <div className="mb-6 flex justify-end">
        <Link href="/admin/chants/create">
          <Button className="rounded-full">
            <Plus className="size-4" />
            Nouveau chant
          </Button>
        </Link>
      </div>

      {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-72 rounded-[28px]" />)
          : sortedChants.map((chant) => (
              <div key={chant.id} className="space-y-3">
                <ChantCard chant={chant} adminHref={`/admin/chants/${chant.id}/edit`} />
                <Button
                  variant="destructive"
                  className="w-full rounded-full"
                  disabled={deletingId === chant.id}
                  onClick={() => handleDelete(chant.id)}
                >
                  <Trash2 className="size-4" />
                  {deletingId === chant.id ? "Suppression..." : "Supprimer"}
                </Button>
              </div>
            ))}
      </div>
    </AppShell>
  );
}
