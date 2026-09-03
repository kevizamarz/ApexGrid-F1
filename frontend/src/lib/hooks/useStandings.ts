"use client";

import useSWR from "swr";
import { fetchDriverStandings, fetchConstructorStandings } from "@/lib/api";
import { DriverStanding, ConstructorStanding } from "@/types/f1";
import { MOCK_DRIVERS_STANDINGS, MOCK_CONSTRUCTORS_STANDINGS } from "@/lib/mockData";

export function useDriverStandings() {
  const { data, error, isLoading } = useSWR<DriverStanding[]>(
    "standings-drivers",
    fetchDriverStandings,
    {
      fallbackData: MOCK_DRIVERS_STANDINGS,
      revalidateOnFocus: false,
    }
  );

  return {
    drivers: data || MOCK_DRIVERS_STANDINGS,
    isLoading,
    isError: !!error,
  };
}

export function useConstructorStandings() {
  const { data, error, isLoading } = useSWR<ConstructorStanding[]>(
    "standings-constructors",
    fetchConstructorStandings,
    {
      fallbackData: MOCK_CONSTRUCTORS_STANDINGS,
      revalidateOnFocus: false,
    }
  );

  return {
    constructors: data || MOCK_CONSTRUCTORS_STANDINGS,
    isLoading,
    isError: !!error,
  };
}
