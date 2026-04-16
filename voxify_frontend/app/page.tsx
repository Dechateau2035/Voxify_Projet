"use client";

import Link from "next/link";
import { ArrowRight, Music2, Radio, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ChantCard } from "@/components/chant-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useChants } from "@/hooks/use-chants";

export default function HomePage() {
  const { chants, loading, error } = useChants();

  const recent = chants.slice(0, 6);
  const popular = [...chants].sort((a, b) => (b.plays ?? 0) - (a.plays ?? 0)).slice(0, 6);

  return (
    <AppShell
      title="Voxify"
      subtitle="Une bibliotheque chorale moderne pour explorer les chants, ecouter chaque voix et travailler plus efficacement en repetition."
    >
      <section className="mb-8 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[32px] border border-border/60 bg-gradient-to-br from-primary/20 via-card/90 to-sky-500/10 p-6 shadow-[0_30px_100px_-50px_rgba(99,102,241,0.7)]">
          <div className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">
            Plateforme de gestion de chants
          </div>
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Travaillez les chants comme dans une app musicale premium.
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Audio principal, pistes soprano/alto/tenor/bass, paroles scrollables et partition PDF dans une seule interface.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/chants">
              <Button className="rounded-full">
                Explorer les chants
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/admin/chants">
              <Button variant="secondary" className="rounded-full">
                Tester l admin
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {[
            { icon: Music2, title: "Catalogue", value: `${chants.length}`, subtitle: "chants disponibles" },
            { icon: Radio, title: "Voix", value: "4+", subtitle: "pistes distinctes prises en charge" },
            { icon: Sparkles, title: "Experience", value: "Dark", subtitle: "interface immersive par defaut" },
          ].map((item) => (
            <div key={item.title} className="rounded-[28px] border border-border/60 bg-card/70 p-5 backdrop-blur">
              <item.icon className="mb-4 size-5 text-primary" />
              <p className="text-2xl font-semibold">{item.value}</p>
              <p className="mt-1 text-sm font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      {error ? <p className="mb-6 text-sm text-destructive">{error}</p> : null}

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Chants recents</h2>
          <Link href="/chants" className="text-sm text-primary">
            Voir tout
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-72 rounded-[28px]" />)
            : recent.map((chant) => <ChantCard key={chant.id} chant={chant} />)}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Chants populaires</h2>
          <Link href="/chants" className="text-sm text-primary">
            Explorer
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-64 min-w-72 rounded-[28px]" />)
            : popular.map((chant) => (
                <div key={chant.id} className="min-w-[280px] flex-1">
                  <ChantCard chant={chant} />
                </div>
              ))}
        </div>
      </section>
    </AppShell>
  );
}
