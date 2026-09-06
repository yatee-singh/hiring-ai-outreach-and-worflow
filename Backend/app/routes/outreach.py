import json

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.db.models.candidate import Candidate


router = APIRouter(
    prefix="/job-campaigns",
    tags=["outreach"],
)


def normalize_summary(summary):
    """
    call_summary can come from PostgreSQL as:
      - dict
      - JSON string
      - None

    Always return a dict.
    """
    if not summary:
        return {}

    if isinstance(summary, dict):
        return summary

    if isinstance(summary, str):
        try:
            parsed = json.loads(summary)

            if isinstance(parsed, dict):
                return parsed

        except (json.JSONDecodeError, TypeError):
            pass

    return {}


def serialize_candidate(candidate: Candidate):
    return {
        "id": str(candidate.id),
        "pdl_id": candidate.pdl_id,

        "name": candidate.full_name,
        "first_name": candidate.first_name,
        "last_name": candidate.last_name,

        "email": candidate.email,
        "phone": candidate.phone,
        "linkedin_url": candidate.linkedin_url,

        "job_title": candidate.job_title,
        "company": candidate.company_name,
        "location": candidate.location,

        "skills": candidate.skills,
        "experience": candidate.experience,
        "education": candidate.education,

        "call_id": candidate.call_id,
        "call_status": candidate.call_status,
        "call_summary": normalize_summary(candidate.call_summary),
        "call_transcript": candidate.call_transcript,

        "created_at": (
            candidate.created_at.isoformat()
            if candidate.created_at
            else None
        ),
    }


@router.get("/{job_campaign_id}/people-dashboard")
async def get_people_dashboard(
    job_campaign_id: str,
    db: AsyncSession = Depends(get_db),
):
    result =  db.execute(
        select(Candidate)
        .where(
            Candidate.job_campaign_id == job_campaign_id
        )
        .order_by(Candidate.created_at.desc())
    )

    candidates = result.scalars().all()

    # -----------------------------------------
    # KPI counters
    # -----------------------------------------

    total_candidates = len(candidates)

    called = 0
    calling = 0
    connected = 0
    interested = 0
    not_interested = 0
    no_answer = 0
    failed = 0
    qualified = 0

    live_calls = []
    interested_candidates = []

    call_status_counts = {}

    # -----------------------------------------
    # Process candidates
    # -----------------------------------------

    for candidate in candidates:

        status = (
            candidate.call_status or ""
        ).lower().strip()

        summary = normalize_summary(
            candidate.call_summary
        )

        # -----------------------------------------
        # Has a call been made?
        # -----------------------------------------

        if candidate.call_id:
            called += 1

        # -----------------------------------------
        # Call status
        # -----------------------------------------

        if status:
            call_status_counts[status] = (
                call_status_counts.get(status, 0) + 1
            )

        # Currently active calls
        if status in {
            "initiated",
            "ringing",
            "calling",
            "in_progress",
            "in-progress",
        }:
            calling += 1

            live_calls.append(
                {
                    "candidate_id": str(candidate.id),
                    "name": candidate.full_name,
                    "phone": candidate.phone,
                    "call_id": candidate.call_id,
                    "status": candidate.call_status,
                }
            )

        elif status in {
            "connected",
            "answered",
        }:
            connected += 1

        elif status in {
            "completed",
        }:
            connected += 1

        elif status in {
            "no_answer",
            "no-answer",
            "not_answered",
        }:
            no_answer += 1

        elif status in {
            "failed",
            "error",
        }:
            failed += 1

        # -----------------------------------------
        # Call summary
        #
        # Example:
        #
        # {
        #     "qualified": "Yes",
        #     "interested": "Yes"
        # }
        # -----------------------------------------

        interested_value = str(
            summary.get("interested", "")
        ).strip().lower()

        qualified_value = str(
            summary.get("qualified", "")
        ).strip().lower()

        # Interested
        if interested_value == "yes":

            interested += 1

            interested_candidates.append(
                serialize_candidate(candidate)
            )

        elif interested_value == "no":

            not_interested += 1

        # Qualified
        if qualified_value == "yes":
            qualified += 1

    # -----------------------------------------
    # Rates
    # -----------------------------------------

    contact_rate = (
        round((connected / called) * 100, 2)
        if called
        else 0
    )

    interest_rate = (
        round((interested / called) * 100, 2)
        if called
        else 0
    )

    # -----------------------------------------
    # Funnel
    # -----------------------------------------

    funnel = [
        {
            "label": "Candidates",
            "count": total_candidates,
        },
        {
            "label": "Called",
            "count": called,
        },
        {
            "label": "Connected",
            "count": connected,
        },
        {
            "label": "Interested",
            "count": interested,
        },
        {
            "label": "Qualified",
            "count": qualified,
        },
    ]

    # -----------------------------------------
    # Call statuses
    # -----------------------------------------

    call_statuses = [
        {
            "status": status,
            "count": count,
        }
        for status, count in call_status_counts.items()
    ]

    # -----------------------------------------
    # Response
    # -----------------------------------------

    return {
        "kpis": {
            "total_candidates": total_candidates,
            "called": called,
            "calling": calling,
            "connected": connected,
            "interested": interested,
            "not_interested": not_interested,
            "no_answer": no_answer,
            "failed": failed,
            "qualified": qualified,
            "contact_rate": contact_rate,
            "interest_rate": interest_rate,
        },

        "funnel": funnel,

        "call_statuses": call_statuses,

        "live_calls": live_calls,

        "interested_candidates": interested_candidates,

        # Full candidate table
        "candidates": [
            serialize_candidate(candidate)
            for candidate in candidates
        ],
    }