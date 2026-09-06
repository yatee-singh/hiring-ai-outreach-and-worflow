import { useCallback, useEffect, useState } from "react";
import { Applicant } from "../types";
import { fetchApplicants } from "../services/applicantApi";

export function useApplicants(jobId: string, status?: string) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApplicants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchApplicants(jobId, status);
      setApplicants(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load applicants.");
    } finally {
      setLoading(false);
    }
  }, [jobId, status]);

  useEffect(() => {
    loadApplicants();
  }, [loadApplicants]);

  return {
    applicants,
    loading,
    error,
    refetch: loadApplicants,
  };
}