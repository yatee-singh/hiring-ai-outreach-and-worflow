from fastapi import APIRouter, Request

router = APIRouter()

@router.post("/hunar")
async def hunar_webhook(
    request: Request
):
    payload = await request.json()

    call_id = payload["call_id"]

    candidate = (
        db.query(Candidate)
        .filter(Candidate.call_id == call_id)
        .first()
    )

    if candidate:

        candidate.call_status = payload.get(
            "status"
        )

        candidate.call_summary = payload.get(
            "summary"
        )

        candidate.call_transcript = payload.get(
            "transcript"
        )

        db.commit()

    return {"success": True}