"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Music4 } from "lucide-react";
import type { Chant } from "@/lib/types";
import { useFavoritesStore } from "@/store/favorites-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type ChantCardProps = {
  chant: Chant;
};

export function ChantCard({ chant }: ChantCardProps) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorite = isFavorite(chant.id);

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden border-border/60 bg-card/70 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="mb-4 flex h-28 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-foreground/20 sm:h-32">
            <Music4 className="size-9 text-primary-foreground/90" />
          </div>
          <CardTitle className="line-clamp-1 text-lg">{chant.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{chant.category}</p>
        </CardHeader>
        <CardContent className="flex min-h-14 flex-wrap gap-2">
          {(Array.isArray(chant.tags) ? chant.tags : []).slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-1 flex-wrap gap-2">
            <Link href={`/chants/${chant.slug}`} className="block w-full min-w-0 sm:inline-block sm:w-auto sm:shrink-0">
              <Button size="sm" className="w-full sm:w-auto">
                Voir
              </Button>
            </Link>
            <Link href={`/chants/edit/${chant.id}`} className="block w-full min-w-0 sm:inline-block sm:w-auto sm:shrink-0">
              <Button size="sm" variant="secondary" className="w-full sm:w-auto">
                Modifier
              </Button>
            </Link>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="self-end sm:self-auto"
            onClick={() => toggleFavorite(chant.id)}
            aria-label="Ajouter aux favoris"
          >
            <Heart className={`size-4 ${favorite ? "fill-current text-primary" : ""}`} />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
