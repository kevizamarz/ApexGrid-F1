from app.services.fastf1_service import init_cache
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_v1_router
from app.core.config import get_settings

# Build configuration once at startup.
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_cache()
    yield


def create_app() -> FastAPI:
    
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        lifespan=lifespan,
        
    )

    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],   # allow GET/POST/etc.
        allow_headers=["*"],   # allow any headers
    )

    # Mount all version-1 endpoints under the shared prefix.
    app.include_router(api_v1_router, prefix=settings.api_v1_prefix)

    return app



app = create_app()
