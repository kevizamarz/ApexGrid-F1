export interface RaceWinner {
  driver_code: string;
  full_name: string;
  team_name: string;
  finish_gap?: string;
}

export interface RaceEvent {
  round: number;
  event_name: string;
  country: string;
  country_code: string;
  flag: string;
  location: string;
  circuit_name: string;
  race_date: string;
  total_laps: number;
  circuit_length_km: number;
  status: "completed" | "current" | "upcoming";
  winner?: RaceWinner;
  track_path: string;
  start_finish?: [number, number];
  corner_count: number;
  drs_zones: number;
  fastest_lap_record?: {
    time: string;
    driver: string;
    year: number;
  };
}
