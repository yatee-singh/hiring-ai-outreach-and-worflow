from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class RoundAnalytics(BaseModel):
    round_id: UUID
    round_name: str

    total_applicants: int
    called_count: int
    not_called_count: int

    completed_count: int
    evaluated_count: int
    scored_count: int

    passed_count: int
    failed_count: int

    average_score: float | None
    passing_score: float | None


class RoundAnalyticsResponse(BaseModel):
    campaign_id: UUID
    rounds: list[RoundAnalytics]


class ApplicantRoundAnalytics(BaseModel):
    applicant_id: UUID
    name: str | None
    email: str | None
    phone: str | None

    applicant_round_id: UUID

    status: str

    called: bool
    hunar_call_id: str | None
    call_status: str | None

    score: float | None
    passing_score: float
    result: str | None

    evaluation: str | None
    call_summary: dict[str, Any] | None

    started_at: Any
    completed_at: Any | None


class RoundApplicantsResponse(BaseModel):
    campaign_id: UUID
    round_id: UUID
    round_name: str

    total: int
    page: int
    page_size: int

    applicants: list[ApplicantRoundAnalytics]


class RoundFunnelItem(BaseModel):
    round_id: UUID
    round_name: str

    total: int
    called: int
    completed: int
    evaluated: int
    passed: int


class RoundFunnelResponse(BaseModel):
    campaign_id: UUID
    rounds: list[RoundFunnelItem]

