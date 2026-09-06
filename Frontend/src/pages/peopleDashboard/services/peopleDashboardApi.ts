import { API_URL } from "../../../config/api";
import type { PeopleDashboardResponse } from "../types";

export async function getPeopleDashboard(
  jobCampaignId: string
): Promise<PeopleDashboardResponse> {
  const response = await fetch(
    `${API_URL}/api/job-campaigns/${jobCampaignId}/people-dashboard`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch people dashboard");
  }

  return response.json();
}