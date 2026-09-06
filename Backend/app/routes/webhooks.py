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
    print("========== HUNAR WEBHOOK HIT ==========", flush=True)

    payload = await request.json()

    print("PAYLOAD RECEIVED:", payload, flush=True)
    print("EVENT TYPE:", payload.get("event_type"), flush=True)
    print("REQUEST ID:", payload.get("request_id"), flush=True)
    print("CALL ID:", payload.get("call_id"), flush=True)

    if payload.get("event_type") != "call_summary":
        print("EVENT IGNORED", flush=True)

        return {
            "success": True,
            "message": "Event ignored",
        }

    request_id = payload.get("request_id")

    print("LOOKING FOR CANDIDATE:", request_id, flush=True)

    if not request_id:
        print("ERROR: request_id missing", flush=True)

        return {
            "success": False,
            "message": "request_id missing",
        }

    candidate = (
        db.query(Candidate)
        .filter(Candidate.id == request_id)
        .first()
    )

    print("CANDIDATE RESULT:", candidate, flush=True)

    if not candidate:
        print(
            f"ERROR: Candidate not found: {request_id}",
            flush=True,
        )

        return {
            "success": False,
            "message": "Candidate not found",
        }

    print(
        f"CANDIDATE FOUND: {candidate.id}",
        flush=True,
    )

    candidate.call_id = payload.get("call_id")
    candidate.call_status = payload.get("status")
    candidate.call_summary = payload.get("result")

    print("UPDATING CANDIDATE:", flush=True)
    print("call_id:", candidate.call_id, flush=True)
    print("call_status:", candidate.call_status, flush=True)
    print("call_summary:", candidate.call_summary, flush=True)

    db.commit()

    print("DATABASE COMMIT SUCCESSFUL", flush=True)

    db.refresh(candidate)

    print(
        "FINAL CANDIDATE:",
        candidate.id,
        candidate.call_id,
        candidate.call_status,
        candidate.call_summary,
        flush=True,
    )

    print("========== HUNAR WEBHOOK SUCCESS ==========", flush=True)

    return {
        "success": True,
        "candidate_id": str(candidate.id),
        "call_id": candidate.call_id,
    }