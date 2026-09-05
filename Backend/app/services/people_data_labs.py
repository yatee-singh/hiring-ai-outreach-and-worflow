import json
from pathlib import Path


class PeopleDataLabsService:

    def __init__(self):
        self.mock_file = (
            Path(__file__).parent / "mock_pdl_response.json"
        )

    async def search(
        self,
        query: dict,
        size: int = 25,
    ):
        with open(self.mock_file, "r") as f:
            response = json.load(f)

        # Simulate the PDL size parameter
        response["data"] = response["data"][:size]

        return response