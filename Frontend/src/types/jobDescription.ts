export interface JobDescriptionForm {
    job_title: string;
    description: string;
    location: string;
    employment_type: string;
    experience_min: number | null;
    experience_max: number | null;
    salary_min: number | null;
    salary_max: number | null;
    skills: string[];
    requirements: string[];
  }