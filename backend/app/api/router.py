from fastapi import APIRouter

from app.api.routes import auth_router, dashboard_router, fields_router, users_router


api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(fields_router)
api_router.include_router(dashboard_router)
api_router.include_router(users_router)
    