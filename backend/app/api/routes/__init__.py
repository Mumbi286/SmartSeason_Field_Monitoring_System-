from .auth import router as auth_router
from .dashboard import router as dashboard_router
from .fields import router as fields_router


__all__ = ["auth_router", "fields_router", "dashboard_router"]
