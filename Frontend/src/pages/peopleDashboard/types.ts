export interface Candidate {
    id: string;
    pdl_id?: string | null;
    name?: string | null;
    job_title?: string | null;
    company?: string | null;
    location?: string | null;
    linkedin_url?: string | null;
    phone?: string | null;
  
    call_id?: string | null;
    call_status?: string | null;
    call_summary?: Record<string, unknown> | null;
  }
  
  export interface DashboardKPIs {
    total_candidates: number;
    called: number;
    calling: number;
    connected: number;
    interested: number;
    not_interested: number;
    no_answer: number;
    failed: number;
    contact_rate: number;
    interest_rate: number;
  }
  
  export interface FunnelItem {
    label: string;
    count: number;
  }
  
  export interface CallStatusItem {
    status: string;
    count: number;
  }
  
  export interface LiveCall {
    candidate_id: string;
    name?: string | null;
    phone?: string | null;
    call_id?: string | null;
    status?: string | null;
  }
  
  export interface PeopleDashboardResponse {
    kpis: DashboardKPIs;
    funnel: FunnelItem[];
    call_statuses: CallStatusItem[];
    live_calls: LiveCall[];
    interested_candidates: Candidate[];
  }