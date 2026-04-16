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
    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("play", onPlay);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("play", onPlay);
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

  const handleSeek = (value: string) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const nextTime = (Number(value) / 100) * duration;
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  return (
    <div className="min-w-0 rounded-3xl border border-border/60 bg-card/75 p-4 shadow-[0_20px_60px_-35px_rgba(124,58,237,0.5)] backdrop-blur">
      <audio key={src ?? "empty"} ref={audioRef} src={src} preload="metadata" />
      <div className="mb-4 flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">Lecteur audio</p>
          <p className="truncate font-medium">{label}</p>
        </div>
        <Button size="icon" variant="secondary" onClick={toggle} disabled={!src} className="rounded-full">
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </Button>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={progress}
        onChange={(event) => handleSeek(event.target.value)}
        disabled={!src}
        aria-label={`Progression audio pour ${label}`}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-transparent accent-primary disabled:cursor-not-allowed"
      />
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
