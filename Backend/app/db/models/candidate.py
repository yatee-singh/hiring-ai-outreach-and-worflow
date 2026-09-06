import uuid
from datetime import datetime

from sqlalchemy import String, Text, DateTime, ForeignKey, JSON, JSONB
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class Candidate(Base):
    __tablename__ = "candidate"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    job_campaign_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("job_campaign.id", ondelete="CASCADE"),
        nullable=False,
    )

    # PDL's person ID
    pdl_id: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    first_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    last_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    full_name: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    email: Mapped[str | None] = mapped_column(
        String(320),
        nullable=True,
    )

    phone: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    linkedin_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    job_title: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    company_name: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    location: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    skills: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    experience: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    education: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    # Keep the original PDL response.
    raw_data: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    ##new 

    call_id: Mapped[str | None] = mapped_column(
            String(255),
            nullable=True,
        )

    call_status: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    call_summary: Mapped[dict | None] = mapped_column(
    JSONB,
    nullable=True,
    )

    call_transcript: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )