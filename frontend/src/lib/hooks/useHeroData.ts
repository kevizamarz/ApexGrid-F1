"use client";

import useSWR from "swr";
import { fetchHeroData } from "@/lib/api";
import { HeroResponse } from "@/types/f1";
import { MOCK_HERO_DATA } from "@/lib/mockData";

export function useHeroData() {
  const { data, error, isLoading } = useSWR<HeroResponse>(
    "hero-latest",
    fetchHeroData,
    {
      fallbackData: MOCK_HERO_DATA,
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  return {
    hero: data || MOCK_HERO_DATA,
    isLoading,
    isError: !!error,
  };
}
