from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.db.models.job_description import JobDescription
from app.services.candidate_search import CandidateSearchService
from app.db.models.candidate import Candidate

router = APIRouter(
    prefix="/people",
    tags=["people"],
)


@router.post("/search/{job_campaign_id}")
async def search_candidates(
    job_campaign_id: str,
    db: AsyncSession = Depends(get_db),
):
    result = db.execute(
        select(JobDescription).where(
            JobDescription.job_campaign_id == job_campaign_id
        )
    )

    jd = result.scalar_one_or_none()

    if not jd:
        return {
            "error": "Job description not found for this job campaign"
        }

    service = CandidateSearchService()

    candidates = await service.search_and_save(
        jd=jd,
        db=db,
        size=25,
    )

    return {
        "count": len(candidates),
        "candidates": [
            {
                "id": str(candidate.id),
                "pdl_id": candidate.pdl_id,
                "name": candidate.full_name,
                "job_title": candidate.job_title,
                "company": candidate.company_name,
                "location": candidate.location,
                "linkedin_url": candidate.linkedin_url,
                "phone": candidate.phone,
            }
            for candidate in candidates
        ],
    }



@router.get("/{job_campaign_id}")
async def get_candidates(
    job_campaign_id: str,
    db: AsyncSession = Depends(get_db),
):
    result = db.execute(
        select(Candidate)
        .where(
            Candidate.job_campaign_id == job_campaign_id
        )
        .order_by(Candidate.created_at.desc())
    )

    candidates = result.scalars().all()

    return {
        "count": len(candidates),
        "candidates": [
            {
                "id": str(candidate.id),
                "pdl_id": candidate.pdl_id,
                "name": candidate.full_name,
                "job_title": candidate.job_title,
                "company": candidate.company_name,
                "location": candidate.location,
                "linkedin_url": candidate.linkedin_url,
                "phone": candidate.phone,
            }
            for candidate in candidates
        ],
    }

