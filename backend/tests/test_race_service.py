"""Unit tests for race_service pure helpers (no network needed)."""
import pandas as pd

from app.services.race_service import _format_timedelta


class TestFormatTimedelta:
    def test_leader_race_time(self):
        # 2h 04m 44.859s -> winner's total race time (in milliseconds)
        total_ms = (2 * 3600 + 4 * 60 + 44) * 1000 + 859
        td = pd.Timedelta(total_ms, unit="ms")
        assert _format_timedelta(td) == "2:04:44.859"

    def test_gap_behind_leader(self):
        td = pd.Timedelta(11536, unit="ms")  # 11.536 sec
        assert _format_timedelta(td) == "0:00:11.536"

    def test_none_returns_none(self):
        assert _format_timedelta(None) is None

    def test_nan_returns_none(self):
        assert _format_timedelta(pd.NaT) is None
