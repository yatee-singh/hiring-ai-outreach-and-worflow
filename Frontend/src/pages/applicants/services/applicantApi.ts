import { Applicant } from "../types";
import { API_URL } from "../../../config/api";

export async function fetchApplicants(
  jobId: string,
  status?: string
): Promise<Applicant[]> {
  const params = new URLSearchParams();

  if (status) {
    params.append("status_filter", status);
  }

  const queryString = params.toString();

  const response = await fetch(
    `${API_URL}/job-campaigns/${jobId}/applicants${
      queryString ? `?${queryString}` : ""
    }`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch applicants");
  }

  return response.json();
}