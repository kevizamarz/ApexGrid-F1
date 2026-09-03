"""Championship standings endpoints (Drivers + Constructors)."""
from fastapi import APIRouter, HTTPException, Query

from app.models.schemas import StandingsResponse
from app.services import standings_service
from app.services.errors import UpstreamDataUnavailableError

router = APIRouter(prefix="/standings", tags=["standings"])


@router.get("", response_model=StandingsResponse)
def get_standings(
    season: int | None = Query(
        default=None, ge=1950, le=2100,
        description="Season year. Defaults to the current year.",
    ),
) -> StandingsResponse:
    """Return Drivers' and Constructors' standings as of the latest GP."""
    try:
        payload = standings_service.get_standings_payload(season=season)
    except UpstreamDataUnavailableError as exc:
        raise HTTPException(status_code=503, detail=exc.message) from exc
    except Exception as exc:  # ergast/network unexpected failures -> clean 503
        raise HTTPException(
            status_code=503, detail="Standings data temporarily unavailable."
        ) from exc
    return StandingsResponse(**payload)
