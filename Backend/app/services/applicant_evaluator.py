# services/applicant_evaluator.py

import json

from app.db.database import SessionLocal
from app.db.models.applicant_round import ApplicantRound
from app.services.openai_evaluator import evaluate_candidate


async def evaluate_applicant_round(
    applicant_round_id: str,
):
    db = SessionLocal()
    applicant_round = None

    try:
        applicant_round = (
            db.query(ApplicantRound)
            .filter(
                ApplicantRound.id == applicant_round_id
            )
            .first()
        )

        if not applicant_round:
            return

        # Try OpenAI evaluation
        try:
            result = await evaluate_candidate(
                summary=applicant_round.call_summary,
                criteria=applicant_round.criteria,
            )

            evaluation = json.loads(result)

            # Store the LLM evidence/evaluation.
            # Do not let the LLM make the final employment decision.
            applicant_round.evaluation = evaluation["evaluation"]

            applicant_round.status = "awaiting_review"

        except Exception as e:
            print(
                f"OpenAI evaluation failed: {e}",
                flush=True,
            )

            # Fallback when OpenAI/API fails
            applicant_round.evaluation = (
                "Automatic evaluation was unavailable. "
                "Please review the interview summary manually."
            )

            applicant_round.status = "awaiting_review"

        db.commit()

    except Exception as e:
        db.rollback()

        print(
            f"Applicant round evaluation failed: {e}",
            flush=True,
        )

        if applicant_round:
            try:
                applicant_round.evaluation = (
                    "Evaluation could not be completed automatically. "
                    "Manual review is required."
                )

                applicant_round.status = "evaluation_failed"

                db.commit()

            except Exception as db_error:
                db.rollback()

                print(
                    f"Failed to save evaluation failure: {db_error}",
                    flush=True,
                )

    finally:
        db.close()