export interface Applicant {
    id: string;
    job_campaign_id: string;
    name: string;
    email: string | null;
    phone: string;
    resume_url: string | null;
    status: string;
    created_at: string;
  }
  
  export interface ApplicantFilters {
    search: string;
    status: string;
  }