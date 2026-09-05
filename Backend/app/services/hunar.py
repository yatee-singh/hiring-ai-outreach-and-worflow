import os
import requests

HUNAR_API_KEY = os.getenv("HUNAR_API_KEY")
HUNAR_BASE_URL = "https://api.voice.hunar.ai"
HUNAR_AGENT_ID = "608a61dd-b378-4a3e-bc17-e1edea9c027d"


def start_call(candidate,organization_name):
    payload = {
        "agent_id": HUNAR_AGENT_ID,
        "callee_name": candidate.full_name,
        "mobile_number": candidate.phone,
        "custom_data": {
            "company": organization_name,
            "job_title": candidate.job_title,
        },
        "request_id": f"call-{candidate.id}",
    }
    print(payload)
    try:
        response = requests.post(
            f"{HUNAR_BASE_URL}/external/v1/calls/",
            headers={
                "X-API-Key": f"{HUNAR_API_KEY}",
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
    



    return response.json()