from uuid import UUID
from typing import List, Optional

from pydantic import BaseModel


class JobDescriptionCreate(BaseModel):
    job_campaign_id: UUID
    job_title: str
    description: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    experience_min: Optional[int] = None
    experience_max: Optional[int] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    skills: Optional[List[str]] = None
    requirements: Optional[List[str]] = None


class JobDescriptionResponse(JobDescriptionCreate):
    id: UUID

    class Config:
        from_attributes = True