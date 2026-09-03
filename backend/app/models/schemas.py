from pydantic import BaseModel, Field


class PodiumDriver(BaseModel):
    """One driver entry, used for the winner and the podium steps."""

    position: int = Field(..., description="Final race position (1 = winner).")
    driver_code: str = Field(..., description="3-letter code, e.g. 'NOR'.")
    full_name: str = Field(..., description="Full name, e.g. 'Lando Norris'.")
    team_name: str = Field(..., description="Constructor, e.g. 'McLaren'.")
    driver_number: int | None = Field(None, description="Permanent driver number.")
    grid_position: int | None = Field(None, description="Starting position.")
    status: str | None = Field(None, description="e.g. 'Finished' or 'DNF'.")
    points: float | None = Field(None, description="Points scored.")
    finish_gap: str | None = Field(
        None,
        description="F1 'Time' interval as H:MM:SS.mmm. Winner: total race time. "
        "All other finishers: time behind the winner.",
    )


class HeroResponse(BaseModel):
    """Payload for the Hero / 'Podium Spotlight' section.

    Represents the most recent COMPLETED grand prix and its podium.
    """

    season: int = Field(..., description="Season year, e.g. 2026.")
    round: int = Field(..., description="Round number of the grand prix.")
    event_name: str = Field(..., description="e.g. 'Dutch Grand Prix'.")
    country: str = Field(..., description="Host country, e.g. 'Netherlands'.")
    location: str = Field(..., description="Circuit/town, e.g. 'Zandvoort'.")
    race_date: str = Field(..., description="Race date (ISO), e.g. '2026-08-23'.")
    total_laps: int | None = Field(None, description="Laps in the race.")
    winner: PodiumDriver = Field(..., description="The race winner.")
    podium: list[PodiumDriver] = Field(
        ..., description="Top-3 finishers (index 0 == winner)."
    )
