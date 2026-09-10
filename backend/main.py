from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import sys
from pathlib import Path

# Support running both from repository root and from backend directory
base_dir = Path(__file__).resolve().parent.parent
backend_dir = Path(__file__).resolve().parent
for p in [str(base_dir), str(backend_dir)]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from backend.routes import candidates, known_laws, data_sync, report, eda, xai, discoverable_laws
except ImportError:
    from routes import candidates, known_laws, data_sync, report, eda, xai, discoverable_laws

app = FastAPI(title="Unknown Unknown Engine API", redirect_slashes=False)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Support both /api/* and /* to handle any Vercel rewrite configuration
routers = [
    candidates.router,
    known_laws.router,
    discoverable_laws.router,
    data_sync.router,
    report.router,
    eda.router,
    xai.router,
]

for router in routers:
    app.include_router(router, prefix="/api")

plots_dir = base_dir / "output" / "plots"
if plots_dir.exists():
    app.mount("/plots", StaticFiles(directory=str(plots_dir)), name="plots")

@app.get("/api/health")
@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/api")
@app.get("/")
def root():
    return {"message": "Unknown Unknown Engine API is running"}