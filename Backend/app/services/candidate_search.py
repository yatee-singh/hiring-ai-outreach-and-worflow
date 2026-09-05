from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.candidate import Candidate
from app.services.people_data_labs import PeopleDataLabsService


class CandidateSearchService:

    def __init__(self):
        self.pdl = PeopleDataLabsService()

    def build_query(self, jd) -> dict:
        """
        Build a simple PDL query from the job description.

        We intentionally keep this simple for now.
        """

        must = []

        # Job title
        if jd.job_title:
            must.append(
                {
                    "match": {
                        "job_title": jd.job_title
                    }
                }
            )

        # Location
        if jd.location:
            must.append(
                {
                    "match": {
                        "location_name": jd.location
                    }
                }
            )

        # Minimum experience
        if jd.experience_min is not None:
            must.append(
                {
                    "range": {
                        "inferred_years_experience": {
                            "gte": jd.experience_min
                        }
                    }
                }
            )

        # Maximum experience
        if jd.experience_max is not None:
            must.append(
                {
                    "range": {
                        "inferred_years_experience": {
                            "lte": jd.experience_max
                        }
                    }
                }
            )

        return {
            "bool": {
                "must": must
            }
        }

    async def search(self, jd, size: int = 25):
        """
        Search PDL using the job description.

        Returns the raw PDL response.
        """

        query = self.build_query(jd)

        return await self.pdl.search(
            query=query,
            size=size,
        )

    def parse_candidate(
        self,
        data: dict,
        job_campaign_id,
    ) -> dict:

        return {
            "job_campaign_id": job_campaign_id,

            "pdl_id": data.get("id"),

            "first_name": data.get("first_name"),
            "last_name": data.get("last_name"),
            "full_name": data.get("full_name"),

            "email": data.get("work_email"),
            "phone": data.get("mobile_phone"),

            "linkedin_url": data.get("linkedin_url"),

            "job_title": data.get("job_title"),
            "company_name": data.get("job_company_name"),

            "location": data.get("location_name"),

            "skills": data.get("skills"),
            "experience": data.get("experience"),
            "education": data.get("education"),

            "raw_data": data,
        }

    async def save_candidate(
        self,
        data: dict,
        db: AsyncSession,
    ) -> Candidate:
        """
        Insert a candidate or update an existing candidate.

        Candidates are identified using:

            job_campaign_id + pdl_id
        """

        pdl_id = data.get("pdl_id")
        job_campaign_id = data.get("job_campaign_id")

        if not pdl_id:
            raise ValueError(
                "PDL response does not contain an id"
            )

        result = db.execute(
            select(Candidate).where(
                Candidate.pdl_id == pdl_id,
                Candidate.job_campaign_id
                == job_campaign_id,
            )
        )

        candidate = result.scalar_one_or_none()

        if candidate:
            # Update existing candidate
            for key, value in data.items():
                setattr(candidate, key, value)

        else:
            # Create new candidate
            candidate = Candidate(**data)

            db.add(candidate)

        return candidate

    async def search_and_save(
        self,
        jd,
        db: AsyncSession,
        size: int = 25,
    ) -> list[Candidate]:
        """
        Search PDL and save all returned candidates.

        Flow:

            JobDescription
                ↓
            PDL query
                ↓
            PDL API
                ↓
            Parse candidates
                ↓
            Upsert into DB
                ↓
            Return candidates
        """

        response = await self.search(
            jd=jd,
            size=size,
        )

        # PDL returns candidates under "data"
        people = response.get("data", [])

        saved_candidates = []

        for person in people:

            # Convert PDL response
            candidate_data = self.parse_candidate(
                data=person,
                job_campaign_id=jd.job_campaign_id,
            )

            # Ignore malformed records
            if not candidate_data.get("pdl_id"):
                continue

            # Save/update
            candidate = await self.save_candidate(
                data=candidate_data,
                db=db,
            )

            saved_candidates.append(candidate)

        # One commit for the entire search
        db.commit()

        return saved_candidates