from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    BackgroundTasks
)
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models.job_campaign import JobCampaign
from app.db.models.workflow_round import WorkflowRound

from app.schemas.workflow import (
    WorkflowReorderRequest,
    WorkflowResponse,
    WorkflowRoundCreate,
    WorkflowRoundResponse,
    WorkflowRoundUpdate,
)
from app.db.models.applicant_round import ApplicantRound
from app.services.workflow_execution import (
    create_execution_records,
    run_round_background,
)
router = APIRouter(
    prefix="",
    tags=["Workflow"],
)

@router.get(
    "/job-campaigns/{job_id}/workflow",
    response_model=WorkflowResponse,
)
def get_workflow(
    job_id: UUID,
    db: Session = Depends(get_db),
):
    job_campaign = (
        db.query(JobCampaign)
        .filter(JobCampaign.id == job_id)
        .first()
    )

    if not job_campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job campaign not found",
        )

    rounds = (
        db.query(WorkflowRound)
        .filter(
            WorkflowRound.job_campaign_id == job_id
        )
        .order_by(WorkflowRound.order)
        .all()
    )

    return {
        "job_campaign_id": job_id,
        "rounds": rounds,
    }

@router.post(
    "/job-campaigns/{job_id}/workflow/rounds",
    response_model=WorkflowRoundResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_workflow_round(
    job_id: UUID,
    payload: WorkflowRoundCreate,
    db: Session = Depends(get_db),
):
    job_campaign = (
        db.query(JobCampaign)
        .filter(JobCampaign.id == job_id)
        .first()
    )

    if not job_campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job campaign not found",
        )

    last_round = (
        db.query(WorkflowRound)
        .filter(
            WorkflowRound.job_campaign_id == job_id
        )
        .order_by(
            WorkflowRound.order.desc()
        )
        .first()
    )

    next_order = (
        last_round.order + 1
        if last_round
        else 1
    )

    workflow_round = WorkflowRound(
        job_campaign_id=job_id,
        name=payload.name,
        order=next_order,
        agent_id=payload.agent_id,
        passing_score=payload.passing_score,
        criteria=[
            criterion.model_dump()
            for criterion in payload.criteria
        ],
    )

    db.add(workflow_round)
    db.commit()
    db.refresh(workflow_round)

    return workflow_round


@router.patch(
    "/workflow-rounds/{round_id}",
    response_model=WorkflowRoundResponse,
)
def update_workflow_round(
    round_id: UUID,
    payload: WorkflowRoundUpdate,
    db: Session = Depends(get_db),
):
    workflow_round = (
        db.query(WorkflowRound)
        .filter(WorkflowRound.id == round_id)
        .first()
    )

    if not workflow_round:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow round not found",
        )

    update_data = payload.model_dump(
        exclude_unset=True
    )

    if "criteria" in update_data:
        update_data["criteria"] = [
            criterion.model_dump()
            for criterion in payload.criteria
        ]

    for field, value in update_data.items():
        setattr(
            workflow_round,
            field,
            value,
        )

    db.commit()
    db.refresh(workflow_round)

    return workflow_round


@router.delete(
    "/workflow-rounds/{round_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_workflow_round(
    round_id: UUID,
    db: Session = Depends(get_db),
):
    workflow_round = (
        db.query(WorkflowRound)
        .filter(WorkflowRound.id == round_id)
        .first()
    )

    if not workflow_round:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow round not found",
        )

    job_id = workflow_round.job_campaign_id

    db.delete(workflow_round)
    db.flush()

    # Re-number remaining rounds
    remaining_rounds = (
        db.query(WorkflowRound)
        .filter(
            WorkflowRound.job_campaign_id == job_id
        )
        .order_by(WorkflowRound.order)
        .all()
    )

    for index, round_item in enumerate(
        remaining_rounds,
        start=1,
    ):
        round_item.order = index

    db.commit()

    return None

@router.post(
    "/workflow-rounds/{round_id}/run"
)
def run_round(
    round_id: UUID,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    workflow_round = (
        db.query(WorkflowRound)
        .filter(
            WorkflowRound.id == round_id
        )
        .first()
    )

    if not workflow_round:
        raise HTTPException(
            status_code=404,
            detail="Workflow round not found",
        )

    if workflow_round.status == "running":
        raise HTTPException(
            status_code=409,
            detail="Round already running",
        )

    db.query(ApplicantRound).filter(
        ApplicantRound.workflow_round_id
        == round_id
    ).delete()

    db.commit()

    executions = create_execution_records(
        db,
        workflow_round,
    )

    workflow_round.status = "running"

    db.commit()

    background_tasks.add_task(
        run_round_background,
        round_id,
    )

    return {
        "workflow_round_id": str(round_id),
        "status": "running",
        "applicants": len(executions),
    }

@router.get(
    "/workflow-rounds/{round_id}/progress"
)
def get_progress(
    round_id: UUID,
    db: Session = Depends(get_db),
):
    rows = (
        db.query(
            ApplicantRound.status,
            func.count(),
        )
        .filter(
            ApplicantRound.workflow_round_id
            == round_id
        )
        .group_by(
            ApplicantRound.status
        )
        .all()
    )

    counts = {
        row[0]: row[1]
        for row in rows
    }

    return {
        "workflow_round_id": str(round_id),

        "total": sum(counts.values()),

        "pending": counts.get(
            "pending",
            0,
        ),

        "calling": counts.get(
            "calling",
            0,
        ),

        "error": counts.get(
            "error",
            0,
        ),
    }