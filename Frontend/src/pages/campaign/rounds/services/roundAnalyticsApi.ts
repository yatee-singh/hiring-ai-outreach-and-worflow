import { API_URL } from "../../../../config/api";

import {
  ApplicantJourneyResponse,
  RoundAnalyticsResponse,
  RoundApplicantsResponse,
  RoundFunnelResponse,
} from "../types";

const get = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      message || `Request failed with status ${response.status}`
    );
  }

  return response.json();
};

export const getRoundAnalytics = async (
  campaignId: string
): Promise<RoundAnalyticsResponse> => {
  return get<RoundAnalyticsResponse>(
    `${API_URL}/api/campaigns/${campaignId}/round-analytics`
  );
};

export const getRoundFunnel = async (
  campaignId: string
): Promise<RoundFunnelResponse> => {
  return get<RoundFunnelResponse>(
    `${API_URL}/api/campaigns/${campaignId}/round-funnel`
  );
};

export const getRoundApplicants = async (
  campaignId: string,
  roundId: string,
  page = 1,
  pageSize = 10
): Promise<RoundApplicantsResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  return get<RoundApplicantsResponse>(
    `${API_URL}/api/campaigns/${campaignId}/rounds/${roundId}/applicants?${params}`
  );
};

export const getApplicantJourney = async (
  campaignId: string,
  applicantId: string
): Promise<ApplicantJourneyResponse> => {
  return get<ApplicantJourneyResponse>(
    `${API_URL}/api/campaigns/${campaignId}/applicants/${applicantId}/rounds`
  );
};

