from uuid import UUID

from sqlalchemy import case, func
from sqlalchemy.orm import Session

from app.db.models.applicant import Applicant
from app.db.models.applicant_round import ApplicantRound
from app.db.models.workflow_round import WorkflowRound


def get_round_analytics(
    db: Session,
    campaign_id: UUID,
):
    """
    Returns aggregated analytics for every workflow round
    belonging to applicants in the campaign.
    """

    rows = (
        db.query(
            WorkflowRound.id.label("round_id"),
            WorkflowRound.name.label("round_name"),

            # Number of ApplicantRound records
            func.count(ApplicantRound.id).label(
                "total_applicants"
            ),

            # Called = Hunar call ID exists
            func.count(
                case(
                    (
                        ApplicantRound.hunar_call_id.isnot(None),
                        1,
                    )
                )
            ).label("called_count"),

            # Not called
            func.count(
                case(
                    (
                        ApplicantRound.hunar_call_id.is_(None),
                        1,
                    )
                )
            ).label("not_called_count"),

            # Completed
            func.count(
                case(
                    (
                        ApplicantRound.status == "completed",
                        1,
                    )
                )
            ).label("completed_count"),

            # Evaluation exists
            func.count(
                case(
                    (
                        ApplicantRound.evaluation.isnot(None),
                        1,
                    )
                )
            ).label("evaluated_count"),

            # Score exists
            func.count(
                case(
                    (
                        ApplicantRound.score.isnot(None),
                        1,
                    )
                )
            ).label("scored_count"),

            # Passed
            func.count(
                case(
                    (
                        (ApplicantRound.score.isnot(None))
                        & (
                            ApplicantRound.score
                            >= ApplicantRound.passing_score
                        ),
                        1,
                    )
                )
            ).label("passed_count"),

            # Failed
            func.count(
                case(
                    (
                        (ApplicantRound.score.isnot(None))
                        & (
                            ApplicantRound.score
                            < ApplicantRound.passing_score
                        ),
                        1,
                    )
                )
            ).label("failed_count"),

            # Average score
            func.avg(
                ApplicantRound.score
            ).label("average_score"),

            # Passing score
            func.max(
                ApplicantRound.passing_score
            ).label("passing_score"),
        )
        .join(
            WorkflowRound,
            WorkflowRound.id
            == ApplicantRound.workflow_round_id,
        )
        .join(
            Applicant,
            Applicant.id
            == ApplicantRound.applicant_id,
        )
        .filter(
            Applicant.job_campaign_id == campaign_id
        )
        .group_by(
            WorkflowRound.id,
            WorkflowRound.name,
        )
        .order_by(
            WorkflowRound.id
        )
        .all()
    )

    return [
        {
            "round_id": row.round_id,
            "round_name": row.round_name,

            "total_applicants": row.total_applicants,
            "called_count": row.called_count,
            "not_called_count": row.not_called_count,

            "completed_count": row.completed_count,
            "evaluated_count": row.evaluated_count,
            "scored_count": row.scored_count,

            "passed_count": row.passed_count,
            "failed_count": row.failed_count,

            "average_score": (
                round(float(row.average_score), 2)
                if row.average_score is not None
                else None
            ),

            "passing_score": (
                float(row.passing_score)
                if row.passing_score is not None
                else None
            ),
        }
        for row in rows
    ]


def get_round_applicants(
    db: Session,
    campaign_id: UUID,
    round_id: UUID,
    page: int = 1,
    page_size: int = 50,
):
    """
    Returns applicant-level information for one workflow round.
    """

    # ---------------------------------------------------------
    # Validate round exists
    # ---------------------------------------------------------

    workflow_round = (
        db.query(WorkflowRound)
        .filter(
            WorkflowRound.id == round_id
        )
        .first()
    )

    if workflow_round is None:
        return None

    # ---------------------------------------------------------
    # Base query
    # ---------------------------------------------------------

    query = (
        db.query(
            ApplicantRound,
            Applicant,
        )
        .join(
            Applicant,
            Applicant.id
            == ApplicantRound.applicant_id,
        )
        .filter(
            Applicant.job_campaign_id == campaign_id,
            ApplicantRound.workflow_round_id == round_id,
        )
    )

    # ---------------------------------------------------------
    # Count
    # ---------------------------------------------------------

    total = query.count()

    # ---------------------------------------------------------
    # Pagination
    # ---------------------------------------------------------

    offset = (page - 1) * page_size

    rows = (
        query
        .order_by(
            ApplicantRound.started_at.desc()
        )
        .offset(offset)
        .limit(page_size)
        .all()
    )

    applicants = []

    for applicant_round, applicant in rows:

        # ---------------------------------------------
        # Determine result
        # ---------------------------------------------

        result = None

        if applicant_round.score is not None:

            if (
                applicant_round.score
                >= applicant_round.passing_score
            ):
                result = "passed"
            else:
                result = "failed"

        # ---------------------------------------------
        # Applicant name
        # ---------------------------------------------

        name = getattr(
            applicant,
            "name",
            None,
        )

        # Some versions of your Applicant model may
        # use first_name / last_name instead.
        if not name:

            first_name = getattr(
                applicant,
                "first_name",
                None,
            )

            last_name = getattr(
                applicant,
                "last_name",
                None,
            )

            name = " ".join(
                part
                for part in [
                    first_name,
                    last_name,
                ]
                if part
            ) or None

        applicants.append(
            {
                "applicant_id": applicant.id,
                "name": name,
                "email": getattr(
                    applicant,
                    "email",
                    None,
                ),
                "phone": getattr(
                    applicant,
                    "phone",
                    None,
                ),

                "applicant_round_id": (
                    applicant_round.id
                ),

                "status": applicant_round.status,

                "called": (
                    applicant_round.hunar_call_id
                    is not None
                ),

                "hunar_call_id": (
                    applicant_round.hunar_call_id
                ),

                "call_status": (
                    applicant_round.call_status
                ),

                "score": (
                    applicant_round.score
                ),

                "passing_score": (
                    applicant_round.passing_score
                ),

                "result": result,

                "evaluation": (
                    applicant_round.evaluation
                ),

                "call_summary": (
                    applicant_round.call_summary
                ),

                "started_at": (
                    applicant_round.started_at
                ),

                "completed_at": (
                    applicant_round.completed_at
                ),
            }
        )

    return {
        "round_name": workflow_round.name,
        "total": total,
        "page": page,
        "page_size": page_size,
        "applicants": applicants,
    }


def get_round_funnel(
    db: Session,
    campaign_id: UUID,
):
    """
    Returns progression metrics for every round.
    """

    rows = (
        db.query(
            WorkflowRound.id.label("round_id"),
            WorkflowRound.name.label("round_name"),

            func.count(
                ApplicantRound.id
            ).label("total"),

            func.count(
                case(
                    (
                        ApplicantRound.hunar_call_id.isnot(None),
                        1,
                    )
                )
            ).label("called"),

            func.count(
                case(
                    (
                        ApplicantRound.status == "completed",
                        1,
                    )
                )
            ).label("completed"),

            func.count(
                case(
                    (
                        ApplicantRound.evaluation.isnot(None),
                        1,
                    )
                )
            ).label("evaluated"),

            func.count(
                case(
                    (
                        (ApplicantRound.score.isnot(None))
                        & (
                            ApplicantRound.score
                            >= ApplicantRound.passing_score
                        ),
                        1,
                    )
                )
            ).label("passed"),
        )
        .join(
            WorkflowRound,
            WorkflowRound.id
            == ApplicantRound.workflow_round_id,
        )
        .join(
            Applicant,
            Applicant.id
            == ApplicantRound.applicant_id,
        )
        .filter(
            Applicant.job_campaign_id == campaign_id
        )
        .group_by(
            WorkflowRound.id,
            WorkflowRound.name,
        )
        .order_by(
            WorkflowRound.id
        )
        .all()
    )

    return [
        {
            "round_id": row.round_id,
            "round_name": row.round_name,

            "total": row.total,
            "called": row.called,
            "completed": row.completed,
            "evaluated": row.evaluated,
            "passed": row.passed,
        }
        for row in rows
    ]

