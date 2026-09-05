from fastapi import FastAPI

from app.routes.people import router as people_router
from app.routes.login import router as login_router
from app.routes.job_campaigns import router as job_campaigns_router
from app.routes.job_description import router as job_description_router
from app.db.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
from app.routes import webhooks

Base.metadata.create_all(bind=engine)
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
app.include_router(job_description_router)
app.include_router(
    webhooks.router,
    prefix="/webhooks",
    tags=["webhooks"]
)
@app.get("/")
async def root():
    return {
        "status": "running"
    }