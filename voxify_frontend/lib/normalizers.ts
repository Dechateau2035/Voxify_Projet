import type { Chant, ChantVoice, UploadedMedia, VoicePart } from "@/lib/types";

type UnknownRecord = Record<string, unknown>;

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  if (typeof value === "string" && value.trim().length > 0) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function asObject(value: unknown): UnknownRecord | null {
  return value && typeof value === "object" ? (value as UnknownRecord) : null;
}

function normalizeUploadedMedia(value: unknown): UploadedMedia | null {
  const obj = asObject(value);
  if (!obj) return null;
  const url = asString(obj.url);
  const public_id = asString(obj.public_id);
  if (!url) return null;
  return { url, public_id };
}

function toVoiceName(part: VoicePart): string {
  return part.charAt(0).toUpperCase() + part.slice(1);
}

function normalizeVoices(value: unknown): ChantVoice[] {
  if (Array.isArray(value)) {
    return value
      .map((voice, index) => {
        const obj = asObject(voice);
        if (!obj) return null;
        const name = asString(obj.name, `Voix ${index + 1}`);
        const audio = normalizeUploadedMedia(obj.audio);
        if (!audio) return null;
        return {
          id: `${name.toLowerCase()}-${index}`,
          name,
          audio,
        };
      })
      .filter((voice): voice is ChantVoice => voice !== null);
  }

  const obj = asObject(value);
  if (!obj) return [];

  const parts: VoicePart[] = ["soprano", "alto", "tenor", "bass"];
  const normalizedVoices: ChantVoice[] = [];

  parts.forEach((part) => {
    const audio = normalizeUploadedMedia(obj[part]);
    if (!audio) return;

    normalizedVoices.push({
      id: part,
      name: toVoiceName(part),
      audio,
    });
  });

  return normalizedVoices;
}

export function normalizeChant(value: unknown): Chant | null {
  const obj = asObject(value);
  if (!obj) return null;

  const idValue = obj.id ?? obj._id;
  const title = asString(obj.title);
  const slug = asString(obj.slug || obj.title?.toString().toLowerCase().replace(/\s+/g, "-"));

  if (!idValue || !title) return null;

  return {
    id: String(idValue),
    title,
    slug,
    category: asString(obj.category, "Non classe"),
    tags: asStringArray(obj.tags),
    coverImage: normalizeUploadedMedia(obj.coverImage),
    coverUrl: normalizeUploadedMedia(obj.coverImage)?.url || asString(obj.coverUrl || obj.cover),
    lyrics: asString(obj.lyrics),
    audioUrl: normalizeUploadedMedia(obj.audioUrl),
    mainAudioUrl: normalizeUploadedMedia(obj.audioUrl)?.url || asString(obj.audio),
    voices: normalizeVoices(obj.voices),
    sheetMusic: normalizeUploadedMedia(obj.sheetMusic),
    sheetMusicUrl: normalizeUploadedMedia(obj.sheetMusic)?.url || asString(obj.sheetMusicUrl || obj.pdf),
    isPublished: Boolean(obj.isPublished),
    createdAt: asString(obj.createdAt),
    plays: typeof obj.plays === "number" ? obj.plays : 0,
  };
}

export function normalizeChantsResponse(data: unknown): Chant[] {
  const raw = Array.isArray(data)
    ? data
    : Array.isArray((data as UnknownRecord)?.data)
      ? ((data as UnknownRecord).data as unknown[])
      : Array.isArray((data as UnknownRecord)?.chants)
        ? ((data as UnknownRecord).chants as unknown[])
        : [];

  return raw.map(normalizeChant).filter((item): item is Chant => item !== null);
}
