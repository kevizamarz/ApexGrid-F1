from fastapi import APIRouter, HTTPException, Query

from app.models.schemas import HeroResponse
from app.services import race_service
from app.services.errors import UpstreamDataUnavailableError

router = APIRouter(prefix="/hero", tags=["hero"])


@router.get("/latest", response_model=HeroResponse)
def latest_hero(
    season: int | None = Query(
        default=None, ge=1950, le=2100,
        description="Season year. Defaults to the current year.",
    ),
    round: int | None = Query(
        default=None, ge=1,
        description="Optional specific GP round. Defaults to most recent completed.",
    ),
) -> HeroResponse:
    """Return the podium/winner spotlight for a grand prix."""
    try:
        payload = race_service.get_hero_payload(season=season, gp_round=round)
    except UpstreamDataUnavailableError as exc:
        # Translate our domain error into a clean HTTP 503 (Service Unavailable).
        raise HTTPException(status_code=503, detail=exc.message) from exc
    return HeroResponse(**payload)
