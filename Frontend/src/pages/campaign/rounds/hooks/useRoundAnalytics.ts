import { useCallback, useEffect, useState } from "react";

import {
  getApplicantJourney,
  getRoundAnalytics,
  getRoundApplicants,
  getRoundFunnel,
} from "../services/roundAnalyticsApi";

import {
  ApplicantJourneyResponse,
  RoundAnalytics,
  RoundApplicantsResponse,
  RoundFunnelItem,
} from "../types";

interface UseRoundAnalyticsReturn {
  rounds: RoundAnalytics[];
  funnel: RoundFunnelItem[];

  loading: boolean;
  error: string | null;

  refresh: () => Promise<void>;

  loadApplicants: (
    roundId: string,
    page?: number,
    pageSize?: number
  ) => Promise<RoundApplicantsResponse>;

  loadApplicantJourney: (
    applicantId: string
  ) => Promise<ApplicantJourneyResponse>;
}

export const useRoundAnalytics = (
  campaignId: string | undefined
): UseRoundAnalyticsReturn => {
  const [rounds, setRounds] = useState<RoundAnalytics[]>([]);
  const [funnel, setFunnel] = useState<RoundFunnelItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!campaignId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [analyticsResponse, funnelResponse] = await Promise.all([
        getRoundAnalytics(campaignId),
        getRoundFunnel(campaignId),
      ]);

      setRounds(analyticsResponse.rounds);
      setFunnel(funnelResponse.rounds);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load round analytics"
      );
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const loadApplicants = useCallback(
    async (
      roundId: string,
      page = 1,
      pageSize = 10
    ): Promise<RoundApplicantsResponse> => {
      if (!campaignId) {
        throw new Error("Campaign ID is required");
      }

      return getRoundApplicants(
        campaignId,
        roundId,
        page,
        pageSize
      );
    },
    [campaignId]
  );

  const loadApplicantJourney = useCallback(
    async (applicantId: string): Promise<ApplicantJourneyResponse> => {
      if (!campaignId) {
        throw new Error("Campaign ID is required");
      }

      return getApplicantJourney(campaignId, applicantId);
    },
    [campaignId]
  );

  return {
    rounds,
    funnel,
    loading,
    error,
    refresh,
    loadApplicants,
    loadApplicantJourney,
  };
};

