from datetime import datetime
import uuid

from sqlalchemy import DateTime, Enum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class Applicant(Base):
    __tablename__ = "applicants"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    job_campaign_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("job_campaign.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    email: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
        index=True,
    )

    phone: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    resume_url: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        Enum(
            "active",
            "rejected",
            "hired",
            name="applicant_status",
        ),
        nullable=False,
        default="active",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    job_campaign: Mapped["JobCampaign"] = relationship(
        "JobCampaign",
        back_populates="applicants",
    )

    rounds: Mapped[list["ApplicantRound"]] = relationship(
    "ApplicantRound",
    back_populates="applicant",
    cascade="all, delete-orphan",
)

