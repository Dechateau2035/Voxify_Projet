import { apiClient } from "@/lib/api/client";
import { normalizeChant, normalizeChantsResponse } from "@/lib/normalizers";
import type { Chant, ChantPayload, VoicePart } from "@/lib/types";

const cache = new Map<string, { data: Chant[]; timestamp: number }>();
const TTL = 30_000;

export async function fetchChants(): Promise<Chant[]> {
  const now = Date.now();
  const cached = cache.get("chants");

  if (cached && now - cached.timestamp < TTL) {
    return cached.data;
  }

  const { data } = await apiClient.get("/chants");
  const normalized = normalizeChantsResponse(data);
  cache.set("chants", { data: normalized, timestamp: now });
  return normalized;
}

export async function fetchChantBySlug(slug: string): Promise<Chant> {
  const { data } = await apiClient.get(`/chants/slug/${slug}`);
  const normalized = normalizeChant(data);
  if (!normalized) {
    throw new Error("Format de chant invalide.");
  }
  return normalized;
}

export async function fetchChantById(id: string): Promise<Chant> {
  const { data } = await apiClient.get(`/chants/${id}`);
  const normalized = normalizeChant(data);
  if (!normalized) {
    throw new Error("Format de chant invalide.");
  }
  return normalized;
}

type ChantFiles = {
  coverImage?: File | null;
  audioUrl?: File | null;
  voices?: Partial<Record<VoicePart, File | null>>;
};

function toFormData(payload: ChantPayload, files?: ChantFiles): FormData {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("category", payload.category ?? "");
  formData.append("lyrics", payload.lyrics ?? "");
  formData.append("tags", (payload.tags ?? []).join(","));
  formData.append("isPublished", String(Boolean(payload.isPublished)));

  if (files?.coverImage) formData.append("coverImage", files.coverImage);
  if (files?.audioUrl) formData.append("audioUrl", files.audioUrl);
  if (files?.voices?.soprano) formData.append("soprano", files.voices.soprano);
  if (files?.voices?.alto) formData.append("alto", files.voices.alto);
  if (files?.voices?.tenor) formData.append("tenor", files.voices.tenor);
  if (files?.voices?.bass) formData.append("bass", files.voices.bass);

  return formData;
}

export async function createChant(payload: ChantPayload, files?: ChantFiles): Promise<Chant> {
  const { data } = await apiClient.post("/chants", toFormData(payload, files), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  cache.delete("chants");
  const normalized = normalizeChant(data);
  if (!normalized) {
    throw new Error("Reponse invalide apres creation.");
  }
  return normalized;
}

export async function updateChant(
  id: string,
  payload: ChantPayload,
  files?: ChantFiles,
): Promise<Chant> {
  const { data } = await apiClient.patch(`/chants/${id}`, toFormData(payload, files), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  cache.delete("chants");
  const normalized = normalizeChant(data);
  if (!normalized) {
    throw new Error("Reponse invalide apres mise a jour.");
  }
  return normalized;
}
