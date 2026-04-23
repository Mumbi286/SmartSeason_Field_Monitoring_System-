from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings

app = FastAPI()

_cors_origins = [
    o.strip() for o in settings.CORS_ALLOW_ORIGINS.split(",") if o.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router) # Including the API router

@app.get("/")
def root():
    return {"message": "Smart Season Field Monitoring System"}

@app.get("/health")
def health():
    return {"status": "OK"}
