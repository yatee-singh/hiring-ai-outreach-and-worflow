from sqlalchemy.orm import Session

from app.services.hunar import start_call
from app.db.models.candidate import Candidate


def call_candidate(
    db: Session,
    candidate_id: str,
    organization_name : str,
    job_name: str
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
        result = start_call(candidate.phone, candidate.full_name, job_name, organization_name, None,candidate_id)

        print("Hunar response:", result.get("id"))

        call_id = result.get("id") if result else None
        print("cakk_id",call_id,result.get("id"),result.get('id'))
        if call_id:
            candidate.call_id = call_id
            candidate.call_status = "initiated"
            db.commit()

    except Exception as e:
        print(f"Failed to call candidate {candidate_id}: {e}")
        db.rollback()


