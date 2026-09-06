import os
import requests

HUNAR_API_KEY = os.getenv("HUNAR_API_KEY")
HUNAR_BASE_URL = "https://api.voice.hunar.ai"
HUNAR_AGENT_ID = "608a61dd-b378-4a3e-bc17-e1edea9c027d"


def start_call(
    candidate_phone,
    candidate_name,
    jobTitle,
    organization_name,
    agent_id=None,
    request_id=None,
):
    payload = {
        ##"agent_id": agent_id or HUNAR_AGENT_ID,
        "agent_id":HUNAR_AGENT_ID,
        "callee_name": candidate_name,
        "mobile_number": candidate_phone,
        "custom_data": {
            "company": organization_name,
            "job_title": jobTitle,
        },
    }

    # Only include request_id when it is provided
    if request_id is not None:
        payload["request_id"] = request_id

    print(payload)

    try:
        response = requests.post(
            f"{HUNAR_BASE_URL}/external/v1/calls/",
            headers={
                "X-API-Key": HUNAR_API_KEY,
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=30,
        )

        response.raise_for_status()

    except requests.exceptions.RequestException as e:
        print(f"Failed to trigger Hunar call: {e}")

        if e.response is not None:
            print(f"Status: {e.response.status_code}")
            print(f"Response: {e.response.text}")

        raise

    return response.json()