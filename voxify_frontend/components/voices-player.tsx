"use client";

import type { ChantVoice } from "@/lib/types";
import { AudioPlayer } from "@/components/audio-player";

type VoicesPlayerProps = {
  voices: ChantVoice[];
};

export function VoicesPlayer({ voices }: VoicesPlayerProps) {
  if (!voices.length) {
    return (
      <div className="rounded-3xl border border-dashed border-border/60 bg-card/50 p-6 text-sm text-muted-foreground">
        Aucune piste de voix disponible pour ce chant.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {voices.map((voice) => (
        <AudioPlayer key={voice.id} src={voice.audio.url} label={voice.name} />
      ))}
    </div>
  );
}
