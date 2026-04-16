"use client";

import { useEffect, useState } from "react";
import { getChants } from "@/lib/api";
import type { Chant } from "@/lib/types";

export function useChants() {
  const [chants, setChants] = useState<Chant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getChants()
      .then((data) => {
        if (!active) return;
        setChants(data);
        setError(null);
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { chants, loading, error };
}
