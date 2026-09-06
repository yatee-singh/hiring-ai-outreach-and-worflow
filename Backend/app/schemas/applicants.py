from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ApplicantCreate(BaseModel):
    name: str
    email: Optional[str] = None
    phone: str
    resume_url: Optional[str] = None


class ApplicantUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    resume_url: Optional[str] = None
    status: Optional[str] = None


class ApplicantResponse(BaseModel):
    id: UUID
    job_campaign_id: UUID
    name: str
    email: Optional[str]
    phone: str
    resume_url: Optional[str]
    status: str
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )