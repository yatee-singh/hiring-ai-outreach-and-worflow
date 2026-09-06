import uuid
from datetime import datetime

from sqlalchemy import (
    DateTime,
    Float,
    ForeignKey,
    Integer,
    JSON,
    String,
    UniqueConstraint,
    Enum
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class WorkflowRound(Base):
    __tablename__ = "workflow_rounds"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    job_campaign_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "job_campaign.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    # 1, 2, 3...
    order: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    # Hunar agent ID
    agent_id: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    # Minimum score required to pass
    passing_score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    # Evaluation criteria
    criteria: Mapped[dict] = mapped_column(
        JSON,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    status: Mapped[str] = mapped_column(
    Enum(
        "draft",
        "running",
        "completed",
        "failed",
        name="workflow_round_status",
    ),
    nullable=False,
    default="draft",
)

    job_campaign: Mapped["JobCampaign"] = relationship(
        "JobCampaign",
        back_populates="workflow_rounds",
    )


    applicant_rounds: Mapped[list["ApplicantRound"]] = relationship(
        "ApplicantRound",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        UniqueConstraint(
            "job_campaign_id",
            "order",
            name="uq_workflow_round_order",
        ),
    )