from app.api.v1.endpoints import hero
from app.api.v1.endpoints import standings
from fastapi import APIRouter

from app.api.v1.endpoints import health

# Version 1 router. Every route added below is automatically namespaced
# under /api/v1 by the main app.
api_v1_router = APIRouter()

api_v1_router.include_router(health.router)
api_v1_router.include_router(hero.router)
api_v1_router.include_router(standings.router)


