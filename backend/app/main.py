from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Smart Season Field Monitoring System"}

@app.get("/health")
def health():
    return {"status": "OK"}

# testing
@app.get("/health")
def health():
    return {"status": "OK"}
