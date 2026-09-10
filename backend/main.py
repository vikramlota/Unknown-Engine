from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import candidates, known_laws

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(candidates.router, prefix="/api")
app.include_router(known_laws.router, prefix="/api")

@app.get("/api/health")
def health():
    return {"status":"ok"}