from datetime import datetime
from typing import Any
from uuid import UUID
from enum import Enum
from pydantic import BaseModel, ConfigDict, Field


class CriteriaItem(BaseModel):
    name: str
    description: str


class WorkflowRoundCreate(BaseModel):
    name: str
    agent_id: str
    passing_score: float = Field(
        ge=0,
        le=100,
    )
    criteria: list[CriteriaItem]


class WorkflowRoundUpdate(BaseModel):
    name: str | None = None
    agent_id: str | None = None
    passing_score: float | None = Field(
        default=None,
        ge=0,
        le=100,
    )
    criteria: list[CriteriaItem] | None = None

class WorkflowRoundStatus(str, Enum):
    DRAFT = "draft"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class WorkflowRoundResponse(BaseModel):
    id: UUID
    job_campaign_id: UUID
    name: str
    order: int
    agent_id: str
    passing_score: float
    criteria: list[dict[str, Any]]
    created_at: datetime
    updated_at: datetime
    status: WorkflowRoundStatus
    model_config = ConfigDict(
        from_attributes=True,
    )


class WorkflowResponse(BaseModel):
    job_campaign_id: UUID
    rounds: list[WorkflowRoundResponse]


class WorkflowReorderRequest(BaseModel):
    round_ids: list[UUID]