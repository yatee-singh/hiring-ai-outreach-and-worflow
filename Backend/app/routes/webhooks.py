from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models.candidate import Candidate

router = APIRouter()


@router.post("/hunar")
async def hunar_webhook(
    request: Request,
    db: Session = Depends(get_db),
):
    payload = await request.json()

    print("Received Hunar webhook:")
    print(payload)

    # Only process the final call summary event
    if payload.get("event_type") != "call_summary":
        return {
            "success": True,
            "message": "Event ignored",
        }

    # request_id = candidate.id
    request_id = payload.get("request_id")

    if not request_id:
        return {
            "success": False,
            "message": "request_id missing",
        }

    candidate = (
        db.query(Candidate)
        .filter(Candidate.id == request_id)
        .first()
    )

    if not candidate:
        return {
            "success": False,
            "message": "Candidate not found",
        }

    # Store Hunar call information
    candidate.call_id = payload.get("call_id")
    candidate.call_status = payload.get("status")

    # Store the structured outcome
    candidate.call_summary = payload.get("result")

    # Optional additional fields if your Candidate model has them
    # candidate.call_recording_url = payload.get("recording_url")
    # candidate.call_duration_seconds = payload.get("duration_seconds")
    # candidate.call_answered_by = payload.get("answered_by")

    db.commit()
    db.refresh(candidate)

    return {
        "success": True,
        "candidate_id": str(candidate.id),
        "call_id": payload.get("call_id"),
    }

