import logging
import os
from pathlib import Path

import fastf1
from fastf1.core import Session

from app.core.config import get_settings
from app.services.errors import UpstreamDataUnavailableError

logger = logging.getLogger(__name__)

# Session-type strings fastf1 understands. Maps our friendly names.
#   FP1/FP2/FP3 = practice, Q = qualifying, S = sprint, R = race
_SESSION_TYPES = ("FP1", "FP2", "FP3", "Q", "S", "R")

# --- Caching bootstrap -----------------------------------------------------


def init_cache() -> None:
    
    settings = get_settings()
    cache_path = Path(settings.fastf1_cache_dir)
    cache_path.mkdir(parents=True, exist_ok=True)
    # 'no_mp' avoids multiprocessing issues in some environments.
    fastf1.Cache.enable_cache(str(cache_path))
    logger.info("FastF1 disk cache enabled at: %s", cache_path.resolve())


def _get_session(year: int, gp_round: int, session_type: str) -> Session:
    
    st = session_type.upper()
    if st not in _SESSION_TYPES:
        raise ValueError(
            f"Invalid session_type '{session_type}'. Expected one of {_SESSION_TYPES}."
        )
    return fastf1.get_session(year, gp_round, st)

# --- Schedule helpers ------------------------------------------------------


def get_schedule(year: int):
    """Return the season's event schedule as a pandas DataFrame.

    Exposes only the rows that correspond to actual races (RoundNumber >= 1),
    dropping the pre-season testing entry which fastf1 labels round 0.
    """
    schedule = fastf1.get_event_schedule(year)
    races = schedule[schedule["RoundNumber"] >= 1].copy()
    races = races.sort_values("RoundNumber").reset_index(drop=True)
    return races


def get_results(session: Session):
    """Return the final classification DataFrame for a loaded session."""
    return session.results

# --- Loaded-session wrapper ------------------------------------------------

def load_session(
    year: int,
    gp_round: int,
    session_type: str,
    *,
    require_laps: bool = True,
) -> Session:
   
    session = _get_session(year, gp_round, session_type)

    try:
        session.load()
    except Exception as exc:  # network errors, provider down, etc.
        logger.warning("fastf1 session load failed for %s %s %s: %s",
                       year, gp_round, session_type, exc)
        raise UpstreamDataUnavailableError(
            f"Could not load {session_type} session for GP round {gp_round} in {year}."
        ) from exc

    # Verify what we asked for actually loaded.
    if require_laps and getattr(session, "laps", None) is None:
        logger.warning("Lap data missing for %s GP %s %s (provider issue?).",
                       year, gp_round, session_type)
        raise UpstreamDataUnavailableError(
            f"Lap/telemetry data unavailable for GP round {gp_round} in {year}."
        )

    return session
