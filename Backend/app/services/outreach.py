from sqlalchemy.orm import Session

from app.services.hunar import start_call
from app.db.models.candidate import Candidate


def call_candidate(
    db: Session,
    candidate_id: str,
    organization_name : str
):
    candidate = (
        db.query(Candidate)
        .filter(Candidate.id == candidate_id)
        .first()
    )

    if not candidate:
        return

    if not candidate.phone:
        return

    try:
        result = start_call(candidate, organization_name)

        print("Hunar response:", result)

        call_id = result.get("call_id") if result else None

        if call_id:
            candidate.call_id = call_id
            candidate.call_status = "initiated"
            db.commit()

    except Exception as e:
        print(f"Failed to call candidate {candidate_id}: {e}")
        db.rollback()