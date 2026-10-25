from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to NEXUS AI API"}

@app.get("/api/health")
def health_check():
    return {"status": "ok", "version": "0.1.0"}
