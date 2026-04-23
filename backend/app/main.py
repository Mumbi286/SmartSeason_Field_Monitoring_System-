from fastapi import FastAPI

from app.api.router import api_router

app = FastAPI()
app.include_router(api_router) # Including the API router

@app.get("/")
def root():
    return {"message": "Smart Season Field Monitoring System"}

@app.get("/health")
def health():
    return {"status": "OK"}
