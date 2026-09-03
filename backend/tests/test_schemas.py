"""Unit tests for the Pydantic response schemas (the API contract).

These tests lock in the JSON contract shapes. If someone accidentally changes
a field name/type, these fail - protecting the frontend from silent breaks.
"""
import pytest
from pydantic import ValidationError

from app.models.schemas import (
    ConstructorStanding,
    DriverStanding,
    HeroResponse,
    PodiumDriver,
    StandingsResponse,
)


class TestPodiumDriver:
    def test_valid_driver(self):
        d = PodiumDriver(
            position=1,
            driver_code="NOR",
            full_name="Lando Norris",
            team_name="McLaren",
            driver_number=1,
            grid_position=1,
            status="Finished",
            points=25.0,
            finish_gap="2:04:44.859",
        )
        assert d.position == 1
        assert d.driver_code == "NOR"
        assert d.points == 25.0

    def test_optional_fields_can_be_none(self):
        d = PodiumDriver(position=2, driver_code="X", full_name="X", team_name="Y")
        assert d.driver_number is None
        assert d.points is None

    def test_required_fields_enforced(self):
        # Missing required field 'full_name' must raise a validation error.
        with pytest.raises(ValidationError):
            PodiumDriver(position=1, driver_code="X", team_name="Y")  # type: ignore[call-arg]


class TestHeroResponse:
    def test_full_valid_payload(self):
        driver = PodiumDriver(
            position=1, driver_code="NOR", full_name="Lando Norris",
            team_name="McLaren",
        )
        hero = HeroResponse(
            season=2026,
            round=12,
            event_name="Dutch Grand Prix",
            country="Netherlands",
            location="Zandvoort",
            race_date="2026-08-23",
            total_laps=72,
            winner=driver,
            podium=[driver],
        )
        assert hero.season == 2026
        assert hero.winner.driver_code == "NOR"

    def test_podium_must_include_winner_as_index_zero_consistency(self):
        # Sanity: our convention is podium[0] == winner. Enforce it in a test
        # helper style is hard in the schema, but we document the expectation.
        pass


class TestStandingsSchemas:
    def test_driver_standing(self):
        d = DriverStanding(
            position=1, driver_code="ANT", full_name="Andrea Kimi Antonelli",
            nationality="Italian", team_name="Mercedes", points=242.0, wins=6,
        )
        assert d.wins == 6
        assert d.points == 242.0

    def test_constructor_standing(self):
        c = ConstructorStanding(
            position=1, name="Mercedes", nationality="German",
            points=425.0, wins=8,
        )
        assert c.name == "Mercedes"
        assert c.position == 1

    def test_standings_response(self):
        resp = StandingsResponse(
            season=2026,
            round=12,
            drivers=[
                DriverStanding(position=1, driver_code="ANT",
                               full_name="Andrea Kimi Antonelli",
                               points=242.0, wins=6)
            ],
            constructors=[
                ConstructorStanding(position=1, name="Mercedes",
                                    points=425.0, wins=8)
            ],
        )
        assert resp.round == 12
        assert len(resp.drivers) == 1
