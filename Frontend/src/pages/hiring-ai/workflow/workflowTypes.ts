// pages/hiring-ai/workflow/workflowTypes.ts

export interface Criterion {
    name: string;
    description: string;
    weight?: number;
  }
  
  export type WorkflowRoundStatus =
    | "draft"
    | "running"
    | "completed"
    | "failed";
  
  export interface WorkflowRound {
    id: string;
    job_campaign_id: string;
    name: string;
    order: number;
    agent_id: string;
    passing_score: number;
    criteria: Criterion[];
    created_at: string;
    updated_at: string;
    status: WorkflowRoundStatus;
  }
  
  export interface WorkflowResponse {
    job_campaign_id: string;
    rounds: WorkflowRound[];
  }
  
  export interface WorkflowRoundCreate {
    name: string;
    agent_id: string;
    passing_score: number;
    criteria: Criterion[];
  }
  
  export interface WorkflowRoundUpdate {
    name?: string;
    agent_id?: string;
    passing_score?: number;
    criteria?: Criterion[];
  }
  
  export interface MockAgent {
    id: string;
    name: string;
    description: string;
  }