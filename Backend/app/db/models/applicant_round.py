import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, JSON, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.db.database import Base


class ApplicantRound(Base):
    __tablename__ = "applicant_rounds"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    applicant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "applicants.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    workflow_round_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "workflow_rounds.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    status: Mapped[str] = mapped_column(
        String,
        nullable=False,
        default="pending",
    )

    hunar_call_id: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
    )

    call_summary: Mapped[dict | None] = mapped_column(
    JSONB,
    nullable=True,
    )

    score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    evaluation: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
    )

    # Snapshot fields
    agent_id: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    passing_score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    criteria: Mapped[dict] = mapped_column(
        JSON,
        nullable=False,
    )

    started_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    applicant: Mapped["Applicant"] = relationship(
        "Applicant",
        back_populates="rounds",
    )

    workflow_round: Mapped["WorkflowRound"] = relationship(
        "WorkflowRound",
    )

    call_status: Mapped[str | None] = mapped_column(
    String(50),
    nullable=True,
)

    