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

class JobDescription(Base):
    __tablename__ = "job_description"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    job_campaign_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("job_campaign.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )

    job_title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    location: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    employment_type: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    experience_min: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    experience_max: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    salary_min: Mapped[float | None] = mapped_column(
        Numeric,
        nullable=True,
    )

    salary_max: Mapped[float | None] = mapped_column(
        Numeric,
        nullable=True,
    )

    skills: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    requirements: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    campaign: Mapped["JobCampaign"] = relationship(
        "JobCampaign",
        back_populates="job_description",
    )