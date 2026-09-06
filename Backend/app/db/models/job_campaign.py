import uuid
from datetime import datetime

from sqlalchemy import (
    String,
    Text,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    JSON,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class JobCampaign(Base):
    __tablename__ = "job_campaign"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="DRAFT",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    organization: Mapped["Organization"] = relationship(
        "Organization",
        back_populates="job_campaigns",
    )

   
    job_description: Mapped["JobDescription"] = relationship(
        "JobDescription",
        back_populates="campaign",
        uselist=False,
        cascade="all, delete-orphan",
    )

    applicants: Mapped[list["Applicant"]] = relationship(
    "Applicant",
    back_populates="job_campaign",
    cascade="all, delete-orphan",)

    workflow_rounds: Mapped[list["WorkflowRound"]] = relationship(
    "WorkflowRound",
    back_populates="job_campaign",
    cascade="all, delete-orphan",
    order_by="WorkflowRound.order",
)

