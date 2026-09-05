from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Candidate
from app.schemas.people import PeopleSearchRequest
from app.services.apollo import search_people


router = APIRouter(
    prefix="/api/people",
    tags=["People"],
)


@router.post("/search")
async def search_people_endpoint(
    request: PeopleSearchRequest,
    db: Session = Depends(get_db),
):

    try:
        # 1. Search Apollo
        result = await search_people(
            job_title=request.job_title,
            location=request.location,
            seniority=request.seniority,
            keywords=request.keywords,
            page=request.page,
            limit=request.limit,
        )

        apollo_people = result.get("people", [])

        saved_people = []

        # 2. Save each person to PostgreSQL
        for person in apollo_people:

            organization = person.get("organization") or {}

            apollo_id = person.get("id")

            if not apollo_id:
                continue

            # Check if candidate already exists
            candidate = (
                db.query(Candidate)
                .filter(Candidate.apollo_id == apollo_id)
                .first()
            )

            if candidate is None:

                candidate = Candidate(
                    apollo_id=apollo_id,
                    first_name=person.get("first_name"),
                    last_name=person.get("last_name_obfuscated"),
                    title=person.get("title"),
                    company=organization.get("name"),
                    location=person.get("city"),
                    linkedin_url=person.get("linkedin_url"),
                    has_email=person.get("has_email"),
                    has_direct_phone=person.get("has_direct_phone"),
                )

                db.add(candidate)

            else:

                # Update existing candidate
                candidate.first_name = person.get("first_name")
                candidate.last_name = person.get("last_name_obfuscated")
                candidate.title = person.get("title")
                candidate.company = organization.get("name")
                candidate.location = person.get("city")
                candidate.linkedin_url = person.get("linkedin_url")
                candidate.has_email = person.get("has_email")
                candidate.has_direct_phone = person.get(
                    "has_direct_phone"
                )

            saved_people.append(candidate)

        # 3. Commit everything
        db.commit()

        # 4. Return response
        people = []

        for candidate in saved_people:
            people.append({
                "id": candidate.id,
                "apollo_id": candidate.apollo_id,
                "first_name": candidate.first_name,
                "last_name": candidate.last_name,
                "title": candidate.title,
                "company": candidate.company,
                "location": candidate.location,
                "linkedin_url": candidate.linkedin_url,
                "has_email": candidate.has_email,
                "has_direct_phone": candidate.has_direct_phone,
            })

        return {
            "total": result.get("total_entries", 0),
            "people": people,
        }

    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )