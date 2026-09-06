import React, { useEffect, useState } from "react";

import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import WorkflowCanvas from "./workflow/WorkflowCanvas";
import WorkflowRoundDialog from "./workflow/WorkflowRoundDialog";
import { runWorkflowRound } from "./workflow/workflowApi";
import {
  createWorkflowRound,
  deleteWorkflowRound,
  getWorkflow,
  updateWorkflowRound,
} from "./workflow/workflowApi";

import { MOCK_AGENTS } from "./workflow/mockAgents";

import {
  WorkflowRound,
  WorkflowRoundCreate,
} from "./workflow/workflowTypes";
import { useCampaign } from "../../hook/useCampaign";

interface Props {
  jobId: string;
}

const WorkflowBuilder: React.FC<Props> = () => {

  const jobId= useCampaign().campaign?.id
  const [rounds, setRounds] = useState<WorkflowRound[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRound, setEditingRound] =
    useState<WorkflowRound | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadWorkflow();
  }, [jobId]);

  const handleRunRound = async (round: WorkflowRound) => {
    try {
      const result = await runWorkflowRound(round.id);
  
      setRounds((prev) =>
        prev.map((item) =>
          item.id === round.id
            ? {
                ...item,
                status: result.status as WorkflowRound["status"],
              }
            : item
        )
      );
  
      console.log(
        `Round started for ${result.applicants} applicants`
      );
    } catch (error) {
      console.error("Failed to run round:", error);
    }
  };
  const loadWorkflow = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getWorkflow(jobId);

      setRounds(data.rounds);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load workflow"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRound(null);
    setDialogOpen(true);
  };

  const handleEdit = (round: WorkflowRound) => {
    setEditingRound(round);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (saving) return;

    setDialogOpen(false);
    setEditingRound(null);
  };

  const handleSubmit = async (
    payload: WorkflowRoundCreate
  ) => {
    try {
      setSaving(true);
      setError("");

      if (editingRound) {
        const updated = await updateWorkflowRound(
          editingRound.id,
          payload
        );

        setRounds((prev) =>
          prev.map((round) =>
            round.id === updated.id
              ? updated
              : round
          )
        );

        setSuccess("Round updated successfully");
      } else {
        const created =
          await createWorkflowRound(
            jobId,
            payload
          );

        setRounds((prev) =>
          [...prev, created].sort(
            (a, b) => a.order - b.order
          )
        );

        setSuccess("Round added successfully");
      }

      setDialogOpen(false);
      setEditingRound(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save round"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    round: WorkflowRound
  ) => {
    const confirmed = window.confirm(
      `Delete "${round.name}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteWorkflowRound(round.id);

      // Your backend renumbers the remaining rounds.
      // Reload so frontend receives the new order values.
      await loadWorkflow();

      setSuccess("Round deleted successfully");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete round"
      );
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        py: 4,
        color: "#000",
      }}
    >
      <Stack spacing={4}>

        {/* Header */}
        <Box>
          <Typography
            variant="h4"
            sx={{
              color: "#000",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Workflow
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#666",
              mt: 0.75,
            }}
          >
            Build the interview process for this
            campaign.
          </Typography>
        </Box>

        {/* Loading */}
        {loading ? (
          <Box
            sx={{
              minHeight: 350,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress
              sx={{ color: "#000" }}
            />
          </Box>
        ) : (
          <WorkflowCanvas
            rounds={rounds}
            agents={MOCK_AGENTS}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRun={handleRunRound}
          />
        )}
      </Stack>

      <WorkflowRoundDialog
        open={dialogOpen}
        round={editingRound}
        agents={MOCK_AGENTS}
        loading={saving}
        onClose={handleCloseDialog}
        onSave={handleSubmit}
      />

      <Snackbar
        open={Boolean(success)}
        autoHideDuration={3000}
        onClose={() => setSuccess("")}
      >
        <Alert
          severity="success"
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={5000}
        onClose={() => setError("")}
      >
        <Alert
          severity="error"
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WorkflowBuilder;