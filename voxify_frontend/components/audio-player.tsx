"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

type AudioPlayerProps = {
  src?: string;
  label: string;
};

function formatTime(seconds: number): string {
  const safe = Number.isFinite(seconds) ? seconds : 0;
  const min = Math.floor(safe / 60);
  const sec = Math.floor(safe % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export function AudioPlayer({ src, label }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  const progress = useMemo(
    () => (duration > 0 ? (currentTime / duration) * 100 : 0),
    [currentTime, duration],
  );

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      void audio.play();
      setPlaying(true);
    }
  };

  return (
    <div className="min-w-0 rounded-xl border border-border/60 bg-card/70 p-3 sm:p-4">
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="mb-3 flex min-w-0 items-center justify-between gap-2">
        <p className="min-w-0 truncate font-medium">{label}</p>
        <Button size="icon" variant="secondary" onClick={toggle} disabled={!src}>
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </Button>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
