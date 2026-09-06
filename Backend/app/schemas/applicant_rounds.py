from uuid import UUID

from pydantic import BaseModel


class RoundProgressResponse(BaseModel):
    workflow_round_id: UUID

    total: int

    pending: int
    calling: int
    completed: int
    error: int