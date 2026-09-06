export interface RoundAnalytics {
  round_id: string;
  round_name: string;

  total_applicants: number;

  called_count: number;
  not_called_count: number;

  completed_count: number;
  evaluated_count: number;
  scored_count: number;

  passed_count: number;
  failed_count: number;

  average_score: number | null;
  passing_score: number | null;
}

export interface RoundAnalyticsResponse {
  campaign_id: string;
  rounds: RoundAnalytics[];
}

export interface ApplicantRoundAnalytics {
  applicant_id: string;
  name: string | null;
  email: string | null;
  phone: string | null;

  applicant_round_id: string;

  status: string;

  called: boolean;
  hunar_call_id: string | null;
  call_status: string | null;

  score: number | null;
  passing_score: number;

  result: "passed" | "failed" | null;

  evaluation: string | null;

  call_summary: Record<string, unknown> | null;

  started_at: string;
  completed_at: string | null;
}

export interface RoundApplicantsResponse {
  campaign_id: string;
  round_id: string;
  round_name: string;

  total: number;

  page: number;
  page_size: number;

  applicants: ApplicantRoundAnalytics[];
}

export interface RoundFunnelItem {
  round_id: string;
  round_name: string;

  total: number;
  called: number;
  completed: number;
  evaluated: number;
  passed: number;
}

export interface RoundFunnelResponse {
  campaign_id: string;
  rounds: RoundFunnelItem[];
}

export interface ApplicantJourneyRound {
  round_id: string;
  round_name: string;

  status: string;

  called: boolean;

  hunar_call_id: string | null;
  call_status: string | null;

  score: number | null;
  passing_score: number;

  result: "passed" | "failed" | null;

  evaluation: string | null;

  call_summary: Record<string, unknown> | null;

  started_at: string;
  completed_at: string | null;
}

export interface ApplicantJourneyResponse {
  applicant_id: string;

  applicant_name: string | null;

  rounds: ApplicantJourneyRound[];
}

