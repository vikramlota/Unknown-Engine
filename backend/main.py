from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from backend.routes import candidates, known_laws, data_sync, report, eda, xai, discoverable_laws

app = FastAPI(title="Unknown Unknown Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(candidates.router, prefix="/api")
app.include_router(known_laws.router, prefix="/api")
app.include_router(discoverable_laws.router, prefix="/api")
app.include_router(data_sync.router, prefix="/api")
app.include_router(report.router, prefix="/api")
app.include_router(eda.router, prefix="/api")
app.include_router(xai.router, prefix="/api")

plots_dir = Path("output/plots")
if plots_dir.exists():
    app.mount("/plots", StaticFiles(directory="output/plots"), name="plots")

@app.get("/api/health")
def health():
    return {"status": "ok"}