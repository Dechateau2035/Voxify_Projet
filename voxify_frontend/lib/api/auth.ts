import { apiClient } from "@/lib/api/client";
import type { AuthPayload, AuthResponse } from "@/lib/types";

export async function login(payload: AuthPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
  return data;
}

export async function register(payload: AuthPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/register", payload);
  return data;
}
