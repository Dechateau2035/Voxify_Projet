import axios from "axios";
import { normalizeChant, normalizeChantsResponse } from "@/lib/normalizers";
import type { Chant, ChantPayload, VoicePart } from "@/lib/types";

const cache = new Map<string, { data: Chant[]; timestamp: number }>();
const TTL = 30_000;

export const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Une erreur est survenue.";

    return Promise.reject(new Error(Array.isArray(message) ? message.join(", ") : String(message)));
  },
);

export async function getChants(): Promise<Chant[]> {
  const now = Date.now();
  const cached = cache.get("chants");

  if (cached && now - cached.timestamp < TTL) {
    return cached.data;
  }

  const { data } = await api.get("/chants");
  const normalized = normalizeChantsResponse(data);
  cache.set("chants", { data: normalized, timestamp: now });
  return normalized;
}

export async function getChantById(id: string): Promise<Chant> {
  const { data } = await api.get(`/chants/${id}`);
  const normalized = normalizeChant(data);

  if (!normalized) {
    throw new Error("Format de chant invalide.");
  }

  return normalized;
}

export async function getChantBySlug(slug: string): Promise<Chant> {
  const { data } = await api.get(`/chants/slug/${slug}`);
  const normalized = normalizeChant(data);

  if (!normalized) {
    throw new Error("Format de chant invalide.");
  }

  return normalized;
}

type ChantFiles = {
  coverImage?: File | null;
  audio?: File | null;
  sheetMusic?: File | null;
  voices?: Array<{
    name: string;
    file: File | null;
  }>;
};

function toVoiceFieldName(name: string): string {
  const normalized = name.trim().toLowerCase();
  const standardVoices: VoicePart[] = ["soprano", "alto", "tenor", "bass"];

  if (standardVoices.includes(normalized as VoicePart)) {
    return normalized;
  }

  return normalized.replace(/\s+/g, "_");
}

function toFormData(payload: ChantPayload, files?: ChantFiles): FormData {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("category", payload.category ?? "");
  formData.append("lyrics", payload.lyrics ?? "");
  formData.append("tags", (payload.tags ?? []).join(","));
  formData.append("isPublished", String(Boolean(payload.isPublished)));

  if (files?.coverImage) {
    formData.append("coverImage", files.coverImage);
  }

  if (files?.audio) {
    formData.append("audioUrl", files.audio);
  }

  if (files?.sheetMusic) {
    formData.append("sheetMusic", files.sheetMusic);
  }

  files?.voices?.forEach((voice) => {
    if (!voice.file) return;
    formData.append(toVoiceFieldName(voice.name), voice.file);
  });

  return formData;
}

export async function createChant(payload: ChantPayload, files?: ChantFiles): Promise<Chant> {
  const { data } = await api.post("/chants", toFormData(payload, files), {
    headers: { "Content-Type": "multipart/form-data" },
  });

  cache.delete("chants");

  const normalized = normalizeChant(data);
  if (!normalized) {
    throw new Error("Reponse invalide apres creation.");
  }

  return normalized;
}

export async function updateChant(id: string, payload: ChantPayload, files?: ChantFiles): Promise<Chant> {
  const { data } = await api.patch(`/chants/${id}`, toFormData(payload, files), {
    headers: { "Content-Type": "multipart/form-data" },
  });

  cache.delete("chants");

  const normalized = normalizeChant(data);
  if (!normalized) {
    throw new Error("Reponse invalide apres mise a jour.");
  }

  return normalized;
}

export async function deleteChant(id: string): Promise<void> {
  await api.delete(`/chants/${id}`);
  cache.delete("chants");
}
