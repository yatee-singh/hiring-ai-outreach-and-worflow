from pydantic import BaseModel, Field
from typing import Optional


class PeopleSearchRequest(BaseModel):
    job_title: Optional[str] = None
    location: Optional[str] = None
    seniority: list[str] = Field(default_factory=list)
    keywords: list[str] = Field(default_factory=list)

    page: int = 1
    limit: int = 10