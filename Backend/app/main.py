from fastapi import FastAPI

from app.routes.people import router as people_router
from app.routes.login import router as login_router
from app.routes.job_campaigns import router as job_campaigns_router
from app.db.database import Base, engine
from app.db.models import Candidate
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AI Recruiter API",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(people_router)
app.include_router(login_router)
app.include_router(job_campaigns_router)
@app.get("/")
async def root():
    return {
        "status": "running"
    }