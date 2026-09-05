import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class JobCampaignCreate(BaseModel):
    name: str


class JobCampaignResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    organization_id: uuid.UUID
    name: str
    status: str
    created_at: datetime
    updated_at: datetime


class JobDescriptionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    job_campaign_id: uuid.UUID
    job_title: str
    description: str | None
    location: str | None
    employment_type: str | None
    experience_min: int | None
    experience_max: int | None
    salary_min: Decimal | None
    salary_max: Decimal | None
    skills: list | None
    requirements: list | None