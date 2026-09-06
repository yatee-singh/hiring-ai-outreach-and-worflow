from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models.applicant import Applicant
from app.db.models.job_campaign import JobCampaign
from app.schemas.applicants import (
    ApplicantCreate,
    ApplicantResponse,
    ApplicantUpdate,
)


router = APIRouter(
    prefix="",
    tags=["Applicants"],
)


@router.post(
    "/job-campaigns/{job_id}/applicants",
    response_model=ApplicantResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_applicant(
    job_id: UUID,
    payload: ApplicantCreate,
    db: Session = Depends(get_db),
):
    # Check that the job exists
    job_campaign = (
        db.query(JobCampaign)
        .filter(JobCampaign.id == job_id)
        .first()
    )

    if not job_campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job campaign not found",
        )

    applicant = Applicant(
        job_campaign_id=job_id,
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        resume_url=payload.resume_url,
    )

    db.add(applicant)
    db.commit()
    db.refresh(applicant)

    return applicant


@router.get(
    "/job-campaigns/{job_id}/applicants",
    response_model=list[ApplicantResponse],
)
def list_applicants(
    job_id: UUID,
    status_filter: str | None = None,
    db: Session = Depends(get_db),
):
    # Make sure the job exists
    job_campaign = (
        db.query(JobCampaign)
        .filter(JobCampaign.id == job_id)
        .first()
    )

    if not job_campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job campaign not found",
        )

    query = (
        db.query(Applicant)
        .filter(Applicant.job_campaign_id == job_id)
    )

    if status_filter:
        query = query.filter(
            Applicant.status == status_filter
        )

    return (
        query
        .order_by(Applicant.created_at.desc())
        .all()
    )

@router.get(
    "/job-campaigns/{job_id}/applicants",
    response_model=list[ApplicantResponse],
)
def list_applicants(
    job_id: UUID,
    status_filter: str | None = None,
    db: Session = Depends(get_db),
):
    # Make sure the job exists
    job_campaign = (
        db.query(JobCampaign)
        .filter(JobCampaign.id == job_id)
        .first()
    )

    if not job_campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job campaign not found",
        )

    query = (
        db.query(Applicant)
        .filter(Applicant.job_campaign_id == job_id)
    )

    if status_filter:
        query = query.filter(
            Applicant.status == status_filter
        )

    return (
        query
        .order_by(Applicant.created_at.desc())
        .all()
    )