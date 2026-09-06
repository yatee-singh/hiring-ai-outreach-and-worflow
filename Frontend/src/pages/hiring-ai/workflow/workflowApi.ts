// pages/hiring-ai/workflow/workflowApi.ts

import {
    WorkflowResponse,
    WorkflowRound,
    WorkflowRoundCreate,
    WorkflowRoundUpdate,
  } from "./workflowTypes";
  import { API_URL } from "../../../config/api";
  

  
  async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let message = "Something went wrong";
  
      try {
        const error = await response.json();
        message = error.detail || message;
      } catch {
        // Ignore JSON parsing errors
      }
  
      throw new Error(message);
    }
  
    if (response.status === 204) {
      return undefined as T;
    }
  
    return response.json();
  }
  
  export async function getWorkflow(
    jobId: string
  ): Promise<WorkflowResponse> {
    const response = await fetch(
      `${API_URL}/job-campaigns/${jobId}/workflow`
    );
  
    return handleResponse<WorkflowResponse>(response);
  }
  
  export async function createWorkflowRound(
    jobId: string,
    payload: WorkflowRoundCreate
  ): Promise<WorkflowRound> {
    const response = await fetch(
      `${API_URL}/job-campaigns/${jobId}/workflow/rounds`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
  
    return handleResponse<WorkflowRound>(response);
  }
  
  export async function updateWorkflowRound(
    roundId: string,
    payload: WorkflowRoundUpdate
  ): Promise<WorkflowRound> {
    const response = await fetch(
      `${API_URL}/workflow-rounds/${roundId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
  
    return handleResponse<WorkflowRound>(response);
  }
  
  export async function deleteWorkflowRound(
    roundId: string
  ): Promise<void> {
    const response = await fetch(
      `${API_URL}/workflow-rounds/${roundId}`,
      {
        method: "DELETE",
      }
    );
  
    return handleResponse<void>(response);
  }

  export interface RunWorkflowRoundResponse {
    workflow_round_id: string;
    status: string;
    applicants: number;
  }
  
  export async function runWorkflowRound(
    roundId: string
  ): Promise<RunWorkflowRoundResponse> {
    const response = await fetch(
      `${API_URL}/workflow-rounds/${roundId}/run`,
      {
        method: "POST",
      }
    );
  
    return handleResponse<RunWorkflowRoundResponse>(response);
  }