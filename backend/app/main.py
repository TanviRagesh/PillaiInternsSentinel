from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import create_db_and_tables
from .api import competitors, articles, system, events
from .workers.scheduler import start_scheduler, stop_scheduler

app = FastAPI(title="SENTINEL API", description="Real-time competitor content monitoring")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    start_scheduler()

@app.on_event("shutdown")
def on_shutdown():
    stop_scheduler()

app.include_router(competitors.router, prefix="/api/competitors", tags=["Competitors"])
app.include_router(articles.router, prefix="/api/articles", tags=["Articles"])
app.include_router(system.router, prefix="/api/system", tags=["System"])
app.include_router(events.router, prefix="/api/events", tags=["Events"])

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
