from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.db.models.applicant import Applicant
from app.db.models.applicant_round import ApplicantRound
from app.db.models.workflow_round import WorkflowRound

from app.services.hunar import start_call


def get_eligible_applicants(
    db: Session,
    workflow_round: WorkflowRound,
):
    """
    MVP:
    everyone in the job campaign.

    Later:
    previous round passers.
    """

    return (
        db.query(Applicant)
        .filter(
            Applicant.job_campaign_id
            == workflow_round.job_campaign_id
        )
        .all()
    )


def create_execution_records(
    db: Session,
    workflow_round: WorkflowRound,
):
    applicants = get_eligible_applicants(
        db,
        workflow_round,
    )

    executions = []

    for applicant in applicants:
        execution = ApplicantRound(
            applicant_id=applicant.id,
            workflow_round_id=workflow_round.id,

            status="pending",

            agent_id=workflow_round.agent_id,
            passing_score=workflow_round.passing_score,
            criteria=workflow_round.criteria,
        )

        executions.append(execution)

    db.add_all(executions)
    db.commit()

    return executions


def process_round_calls(
    db: Session,
    workflow_round: WorkflowRound,
):
    executions = (
        db.query(ApplicantRound)
        .filter(
            ApplicantRound.workflow_round_id
            == workflow_round.id
        )
        .all()
    )

    for execution in executions:

        applicant = execution.applicant

        try:
            execution.status = "calling"
            db.commit()

            response = start_call(
                candidate_phone=applicant.phone,
                candidate_name=applicant.name,

                jobTitle=workflow_round.name,
                organization_name="Organization",

                # applicant_round_id=str(execution.id),
                # workflow_round_id=str(
                #     workflow_round.id
                # ),

                agent_id=execution.agent_id,
                request_id=str(execution.id)
            )

            execution.hunar_call_id = (
                response.get("id")
                or response.get("call_id")
            )

            db.commit()

        except Exception:
            print(Exception)
            execution.status = "error"
            db.commit()


def run_round_background(
    workflow_round_id,
):
    db = SessionLocal()

    try:
        workflow_round = (
            db.query(WorkflowRound)
            .filter(
                WorkflowRound.id
                == workflow_round_id
            )
            .first()
        )

        if not workflow_round:
            return

        process_round_calls(
            db,
            workflow_round,
        )

    finally:
        db.close()