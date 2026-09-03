import { HeroResponse, DriverStanding, ConstructorStanding } from "@/types/f1";
import { MOCK_HERO_DATA, MOCK_DRIVERS_STANDINGS, MOCK_CONSTRUCTORS_STANDINGS } from "./mockData";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export async function fetchHeroData(): Promise<HeroResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/hero/latest`, {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      console.warn(`Backend responded with ${res.status}, falling back to mock hero data.`);
      return MOCK_HERO_DATA;
    }
    
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn("Backend unavailable, using mock hero data:", err);
    return MOCK_HERO_DATA;
  }
}

export async function fetchDriverStandings(): Promise<DriverStanding[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/standings/drivers`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Expected until backend standings endpoint is wired
  }
  return MOCK_DRIVERS_STANDINGS;
}

export async function fetchConstructorStandings(): Promise<ConstructorStanding[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/standings/constructors`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Expected until backend standings endpoint is wired
  }
  return MOCK_CONSTRUCTORS_STANDINGS;
}
