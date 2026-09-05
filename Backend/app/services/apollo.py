import os

import httpx
from dotenv import load_dotenv

load_dotenv()

APOLLO_URL = "https://api.apollo.io/api/v1/mixed_people/api_search"

APOLLO_API_KEY = os.getenv("APOLLO_API_KEY")


async def search_people(
    job_title: str | None = None,
    location: str | None = None,
    seniority: list[str] | None = None,
    keywords: list[str] | None = None,
    page: int = 1,
    limit: int = 10,
):
    params = {
        "page": page,
        "per_page": limit,
    }

    if job_title:
        params["person_titles[]"] = job_title

    if location:
        params["person_locations[]"] = location

    if seniority:
        params["person_seniorities[]"] = seniority

    if keywords:
        params["q_keywords"] = " ".join(keywords)

    headers = {
        "accept": "application/json",
        "x-api-key": APOLLO_API_KEY,
        "Cache-Control": "no-cache",
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            APOLLO_URL,
            params=params,
            headers=headers,
            timeout=30,
        )

    response.raise_for_status()

    return response.json()