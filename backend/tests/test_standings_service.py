from app.services.standings_service import (
    _constructor_row_to_entry,
    _driver_row_to_entry,
)

# --- Realistic sample raw row (mirrors fastf1/ergast structure) ----------

SAMPLE_DRIVER_ROW = {
    "position": 1,
    "positionText": "1",
    "points": 242.0,
    "wins": 6,
    "Driver": {
        "driverId": "antonelli",
        "permanentNumber": 12,
        "code": "ANT",
        "givenName": "Andrea Kimi",
        "familyName": "Antonelli",
        "nationality": "Italian",
    },
    "Constructors": [{"constructorId": "mercedes", "name": "Mercedes"}],
}

SAMPLE_CONSTRUCTOR_ROW = {
    "position": 1,
    "positionText": "1",
    "points": 425.0,
    "wins": 8,
    "Constructor": {
        "constructorId": "mercedes",
        "name": "Mercedes",
        "nationality": "German",
    },
}


class TestDriverRowMapping:
    def test_full_name_joins_given_and_family(self):
        out = _driver_row_to_entry(SAMPLE_DRIVER_ROW)
        assert out["full_name"] == "Andrea Kimi Antonelli"

    def test_code_and_position(self):
        out = _driver_row_to_entry(SAMPLE_DRIVER_ROW)
        assert out["driver_code"] == "ANT"
        assert out["position"] == 1

    def test_points_and_wins_are_numeric(self):
        out = _driver_row_to_entry(SAMPLE_DRIVER_ROW)
        assert out["points"] == 242.0
        assert out["wins"] == 6
        assert isinstance(out["points"], float)

    def test_multiple_constructors_joined(self):
        row = dict(SAMPLE_DRIVER_ROW)
        row["Constructors"] = [
            {"name": "RB F1 Team"},
            {"name": "Red Bull"},
        ]
        out = _driver_row_to_entry(row)
        assert out["team_name"] == "RB F1 Team, Red Bull"

    def test_missing_constructor_name_gives_none(self):
        row = dict(SAMPLE_DRIVER_ROW)
        row["Constructors"] = []
        out = _driver_row_to_entry(row)
        assert out["team_name"] is None


class TestConstructorRowMapping:
    def test_basic_mapping(self):
        out = _constructor_row_to_entry(SAMPLE_CONSTRUCTOR_ROW)
        assert out["name"] == "Mercedes"
        assert out["position"] == 1
        assert out["nationality"] == "German"
        assert out["points"] == 425.0
        assert out["wins"] == 8
