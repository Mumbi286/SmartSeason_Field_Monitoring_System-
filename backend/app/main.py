import os
import json
import time

from fastapi import FastAPI
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings

app = FastAPI()

_cors_origins = [o.strip() for o in settings.CORS_ALLOW_ORIGINS.split(",") if o.strip()]
_frontend_url = os.getenv("FRONTEND_URL", "").strip()
if _frontend_url and _frontend_url not in _cors_origins:
    _cors_origins.append(_frontend_url)
app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_cors_debug(request: Request, call_next):
    try:
        with open("/home/crissa/Documents/smartseason_field_monitoring_system/.cursor/debug-9f9890.log", "a", encoding="utf-8") as f:
            f.write(
                json.dumps(
                    {
                        "sessionId": "9f9890",
                        "runId": "run1",
                        "hypothesisId": "H2",
                        "location": "backend/app/main.py:27",
                        "message": "backend request received",
                        "data": {
                            "method": request.method,
                            "path": request.url.path,
                            "origin": request.headers.get("origin", ""),
                            "allowedOrigins": _cors_origins,
                        },
                        "timestamp": int(time.time() * 1000),
                    }
                )
                + "\n"
            )
    except Exception:
        pass

    response = await call_next(request)

    try:
        with open("/home/crissa/Documents/smartseason_field_monitoring_system/.cursor/debug-9f9890.log", "a", encoding="utf-8") as f:
            f.write(
                json.dumps(
                    {
                        "sessionId": "9f9890",
                        "runId": "run1",
                        "hypothesisId": "H4",
                        "location": "backend/app/main.py:53",
                        "message": "backend response headers",
                        "data": {
                            "method": request.method,
                            "path": request.url.path,
                            "statusCode": response.status_code,
                            "allowOriginHeader": response.headers.get("access-control-allow-origin", ""),
                        },
                        "timestamp": int(time.time() * 1000),
                    }
                )
                + "\n"
            )
    except Exception:
        pass

    return response

app.include_router(api_router) # Including the API router

@app.get("/")
def root():
    return {"message": "Smart Season Field Monitoring System"}

@app.get("/health")
def health():
    return {"status": "OK"}
