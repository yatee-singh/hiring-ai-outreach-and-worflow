import { useCallback, useEffect, useState } from "react";
import { getPeopleDashboard } from "../services/peopleDashboardApi";
import type { PeopleDashboardResponse } from "../types";

interface UsePeopleDashboardResult {
  data: PeopleDashboardResponse | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const POLL_INTERVAL = 60_000; // 60 seconds

export function usePeopleDashboard(
  jobCampaignId?: string
): UsePeopleDashboardResult {
  const [data, setData] =
    useState<PeopleDashboardResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] =
    useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!jobCampaignId) {
      setLoading(false);
      return;
    }

    try {
      setError(null);

      const result = await getPeopleDashboard(
        jobCampaignId
      );

      setData(result);
    } catch (err) {
      console.error(
        "Failed to load people dashboard:",
        err
      );

      setError("Unable to load people dashboard");
    } finally {
      setLoading(false);
    }
  }, [jobCampaignId]);

  useEffect(() => {
    if (!jobCampaignId) {
      return;
    }

    // Fetch immediately
    loadDashboard();

    // Then refresh every 60 seconds
    const interval = setInterval(() => {
      loadDashboard();
    }, POLL_INTERVAL);

    // Cleanup when component unmounts
    return () => {
      clearInterval(interval);
    };
  }, [jobCampaignId, loadDashboard]);

  return {
    data,
    loading,
    error,
    refresh: loadDashboard,
  };
}