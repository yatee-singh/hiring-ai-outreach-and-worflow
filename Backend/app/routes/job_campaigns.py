import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models.job_campaign import JobCampaign
from app.db.models.job_description import JobDescription
from app.schemas.job_campaigns import (
    JobCampaignCreate,
    JobCampaignResponse,
    JobDescriptionResponse,
)

router = APIRouter(
    prefix="/organizations",
    tags=["Job Campaigns"],
)


@router.get(
    "/{organization_id}/job-campaigns",
    response_model=list[JobCampaignResponse],
)
def list_job_campaigns(
    organization_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    campaigns = db.scalars(
        select(JobCampaign)
        .where(JobCampaign.organization_id == organization_id)
        .order_by(JobCampaign.created_at.desc())
    ).all()

    return campaigns


@router.post(
    "/{organization_id}/job-campaigns",
    response_model=JobCampaignResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_job_campaign(
    organization_id: uuid.UUID,
    payload: JobCampaignCreate,
    db: Session = Depends(get_db),
):
    campaign = JobCampaign(
        organization_id=organization_id,
        name=payload.name,
        status="DRAFT",
        # Replace this with your authenticated user's ID
        # once authentication dependency is wired in.
       
        
    )

    db.add(campaign)
    db.commit()
    db.refresh(campaign)

    return campaign


@router.get(
    "/{organization_id}/job-campaigns/{campaign_id}/job-description",
    response_model=JobDescriptionResponse,
)
def get_job_description(
    organization_id: uuid.UUID,
    campaign_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    campaign = db.scalar(
        select(JobCampaign).where(
            JobCampaign.id == campaign_id,
            JobCampaign.organization_id == organization_id,
        )
    )

    if campaign is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job campaign not found",
        )

    job_description = db.scalar(
        select(JobDescription).where(
            JobDescription.job_campaign_id == campaign_id
        )
    )

    if job_description is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job description not found",
        )

    return job_description