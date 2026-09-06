from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.applicant_rounds import (
    RoundAnalyticsResponse,
    RoundApplicantsResponse,
    RoundFunnelResponse,
)
from app.services.applicant_round_analytics import (
    get_round_analytics,
    get_round_applicants,
    get_round_funnel,
)

router = APIRouter(
    prefix="/api/campaigns",
    tags=["Applicant Round Analytics"],
)


# ============================================================
# ROUND ANALYTICS
# ============================================================

@router.get(
    "/{campaign_id}/round-analytics",
    response_model=RoundAnalyticsResponse,
)
def round_analytics(
    campaign_id: UUID,
    db: Session = Depends(get_db),
):
    rounds = get_round_analytics(
        db=db,
        campaign_id=campaign_id,
    )

    return {
        "campaign_id": campaign_id,
        "rounds": rounds,
    }


# ============================================================
# ROUND APPLICANTS
# ============================================================

@router.get(
    "/{campaign_id}/rounds/{round_id}/applicants",
    response_model=RoundApplicantsResponse,
)
def round_applicants(
    campaign_id: UUID,
    round_id: UUID,
    page: int = Query(
        1,
        ge=1,
    ),
    page_size: int = Query(
        50,
        ge=1,
        le=200,
    ),
    db: Session = Depends(get_db),
):
    result = get_round_applicants(
        db=db,
        campaign_id=campaign_id,
        round_id=round_id,
        page=page,
        page_size=page_size,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Workflow round not found",
        )

    return {
        "campaign_id": campaign_id,
        "round_id": round_id,
        **result,
    }


# ============================================================
# ROUND FUNNEL
# ============================================================

@router.get(
    "/{campaign_id}/round-funnel",
    response_model=RoundFunnelResponse,
)
def round_funnel(
    campaign_id: UUID,
    db: Session = Depends(get_db),
):
    rounds = get_round_funnel(
        db=db,
        campaign_id=campaign_id,
    )

    return {
        "campaign_id": campaign_id,
        "rounds": rounds,
    }

