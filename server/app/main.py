from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine
from app.api.letters import router as letters_router
from app.services.scheduler import start_scheduler
from app.config import ALLOWED_ORIGINS, UPLOAD_DIR

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Amor Fati")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.include_router(letters_router)


@app.on_event("startup")
def on_startup():
    start_scheduler()


@app.get("/api/health")
def health():
    return {"status": "sealed and ready"}
