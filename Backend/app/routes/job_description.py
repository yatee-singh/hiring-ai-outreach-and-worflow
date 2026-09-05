from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from app.db.database import get_db
from app.db.models.job_description import JobDescription
from app.db.models.job_campaign import JobCampaign
from app.schemas.job_descriptions import (
    JobDescriptionCreate,
    JobDescriptionResponse,
)

router = APIRouter(
    prefix="/job-descriptions",
    tags=["Job Descriptions"],
)

@router.post(
    "/",
    response_model=JobDescriptionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_job_description(
    payload: JobDescriptionCreate,
    db: Session = Depends(get_db),
):
    # Check campaign exists
    campaign = (
        db.query(JobCampaign)
        .filter(JobCampaign.id == payload.job_campaign_id)
        .first()
    )

    if not campaign:
        raise HTTPException(
            status_code=404,
            detail="Job campaign not found",
        )

    # Enforce one JD per campaign
    existing = (
        db.query(JobDescription)
        .filter(
            JobDescription.job_campaign_id == payload.job_campaign_id
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Job description already exists for this campaign",
        )

    job_description = JobDescription(
        job_campaign_id=payload.job_campaign_id,
        job_title=payload.job_title,
        description=payload.description,
        location=payload.location,
        employment_type=payload.employment_type,
        experience_min=payload.experience_min,
        experience_max=payload.experience_max,
        salary_min=payload.salary_min,
        salary_max=payload.salary_max,
        skills=payload.skills,
        requirements=payload.requirements,
    )

    db.add(job_description)
    db.commit()
    db.refresh(job_description)

    return job_description


@router.get(
    "/campaign/{job_campaign_id}",
    response_model=JobDescriptionResponse,
)
def get_job_description(
    job_campaign_id: UUID,
    db: Session = Depends(get_db),
):
    # Check campaign exists
    campaign = (
        db.query(JobCampaign)
        .filter(JobCampaign.id == job_campaign_id)
        .first()
    )

    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job campaign not found",
        )

    # Get job description for this campaign
    job_description = (
        db.query(JobDescription)
        .filter(
            JobDescription.job_campaign_id == job_campaign_id
        )
        .first()
    )

    if not job_description:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job description not found",
        )

    return job_description

