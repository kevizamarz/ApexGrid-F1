class UpstreamDataUnavailableError(Exception):
    """Raised when the F1 data provider cannot supply the requested data.

    The endpoint layer catches this and responds with a clean HTTP error
    instead of crashing or returning half-empty payloads.
    """

    def __init__(self, message: str = "F1 data source temporarily unavailable."):
        super().__init__(message)
        self.message = message