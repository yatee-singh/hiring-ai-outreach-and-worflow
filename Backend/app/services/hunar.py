import os
import requests

HUNAR_API_KEY = os.getenv("HUNAR_API_KEY")
HUNAR_BASE_URL = "https://api.voice.hunar.ai"
HUNAR_AGENT_ID = "608a61dd-b378-4a3e-bc17-e1edea9c027d"

DEFAULT_CALLBACK_URL = (
    "https://hiring-ai-outreach-and-worflow.onrender.com/"
    "webhooks/hunar"
)

APPLICANT_ROUND_CALLBACK_URL = (
    "https://hiring-ai-outreach-and-worflow.onrender.com/"
    "webhooks/hunar/applicant-round"
)


def start_call(
    candidate_phone,
    candidate_name,
    jobTitle,
    organization_name,
    agent_id=None,
    request_id=None,
):
    # Use explicitly provided agent_id, otherwise use default MVP agent
    selected_agent_id = agent_id or HUNAR_AGENT_ID

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

    # Only include request_id when provided
    if request_id is not None:
        payload["request_id"] = request_id

    # If a custom agent_id is provided, use applicant-round webhook.
    # Otherwise use the default outreach webhook.
    if agent_id is not None:
        callback_url = APPLICANT_ROUND_CALLBACK_URL
    else:
        callback_url = DEFAULT_CALLBACK_URL

    payload["callback_config"] = {
        "call_summary_callback_url": callback_url
    }

    print("Hunar payload:", payload)

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

