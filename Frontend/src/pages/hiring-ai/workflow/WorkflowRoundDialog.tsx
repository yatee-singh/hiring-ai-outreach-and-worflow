import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  Criterion,
  MockAgent,
  WorkflowRound,
  WorkflowRoundCreate,
  WorkflowRoundUpdate,
} from "./workflowTypes";

interface WorkflowRoundDialogProps {
  open: boolean;
  round?: WorkflowRound | null;
  agents: MockAgent[];
  onClose: () => void;
  onSave: (
    payload: WorkflowRoundCreate | WorkflowRoundUpdate
  ) => Promise<void>;
}

const AVAILABLE_CRITERIA = [
  "Technical Skills",
  "Problem Solving",
  "Communication",
  "Relevant Experience",
  "Leadership",
  "Cultural Fit",
  "Role Knowledge",
  "Analytical Thinking",
  "Adaptability",
  "Teamwork",
];

const CRITERION_DESCRIPTIONS: Record<string, string> = {
  "Technical Skills": "Knowledge and proficiency in relevant technical skills.",
  "Problem Solving": "Ability to analyze problems and develop effective solutions.",
  Communication: "Ability to communicate clearly and effectively.",
  "Relevant Experience": "Experience relevant to the requirements of the role.",
  Leadership: "Ability to lead, influence, and take ownership.",
  "Cultural Fit": "Alignment with the organization's values and working style.",
  "Role Knowledge": "Understanding of the responsibilities and requirements of the role.",
  "Analytical Thinking": "Ability to reason through complex information and make decisions.",
  Adaptability: "Ability to adapt to changing situations and requirements.",
  Teamwork: "Ability to collaborate effectively with others.",
};

const DEFAULT_WEIGHT = 10;

const emptyCriterion = (): Criterion => ({
  name: "",
  description: "",
  weight: DEFAULT_WEIGHT,
});

export default function WorkflowRoundDialog({
  open,
  round,
  agents,
  onClose,
  onSave,
}: WorkflowRoundDialogProps) {
  const isEditing = Boolean(round);

  const [name, setName] = useState("");
  const [agentId, setAgentId] = useState("");
  const [passingScore, setPassingScore] = useState(70);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (round) {
      setName(round.name);
      setAgentId(round.agent_id);
      setPassingScore(round.passing_score);

      setCriteria(
        round.criteria?.length
          ? round.criteria.map((criterion) => ({
              ...criterion,
              weight: criterion.weight ?? DEFAULT_WEIGHT,
            }))
          : []
      );
    } else {
      setName("");
      setAgentId(agents[0]?.id ?? "");
      setPassingScore(70);
      setCriteria([]);
    }
  }, [open, round, agents]);

  const handleCriterionChange = (
    index: number,
    criterionName: string
  ) => {
    setCriteria((prev) =>
      prev.map((criterion, i) =>
        i === index
          ? {
              ...criterion,
              name: criterionName,
              description:
                CRITERION_DESCRIPTIONS[criterionName] ?? "",
            }
          : criterion
      )
    );
  };

  const handleWeightChange = (
    index: number,
    value: string
  ) => {
    const weight = Number(value);

    setCriteria((prev) =>
      prev.map((criterion, i) =>
        i === index
          ? {
              ...criterion,
              weight: Number.isNaN(weight) ? 0 : weight,
            }
          : criterion
      )
    );
  };

  const addCriterion = () => {
    setCriteria((prev) => [...prev, emptyCriterion()]);
  };

  const removeCriterion = (index: number) => {
    setCriteria((prev) => prev.filter((_, i) => i !== index));
  };

  const getAvailableCriteria = (currentIndex: number) => {
    const selectedByOtherRows = criteria
      .filter((_, index) => index !== currentIndex)
      .map((criterion) => criterion.name)
      .filter(Boolean);

    return AVAILABLE_CRITERIA.filter(
      (criterion) => !selectedByOtherRows.includes(criterion)
    );
  };

  const handleSubmit = async () => {
    if (!name.trim() || !agentId) return;

    const validCriteria = criteria.filter(
      (criterion) => criterion.name
    );

    const payload = {
      name: name.trim(),
      agent_id: agentId,
      passing_score: passingScore,
      criteria: validCriteria,
    };

    try {
      setLoading(true);
      await onSave(payload);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ color: "#000", fontWeight: 600 }}>
        {isEditing ? "Edit Workflow Round" : "Add Workflow Round"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Round Name */}
          <TextField
            fullWidth
            label="Round Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            InputLabelProps={{ sx: { color: "#000" } }}
            inputProps={{ style: { color: "#000" } }}
          />

          {/* Agent */}
          <Box>
            <Typography
              variant="body2"
              sx={{ mb: 1, color: "#000", fontWeight: 500 }}
            >
              Agent
            </Typography>

            <Select
              fullWidth
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              sx={{ color: "#000" }}
            >
              {agents.map((agent) => (
                <MenuItem key={agent.id} value={agent.id}>
                  {agent.name}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Passing Score */}
          {/* <TextField
            fullWidth
            type="number"
            label="Passing Score"
            value={passingScore}
            onChange={(e) =>
              setPassingScore(Number(e.target.value))
            }
            inputProps={{
              min: 0,
              max: 100,
            }}
            InputLabelProps={{ sx: { color: "#000" } }}
            inputProps={{
              min: 0,
              max: 100,
              style: { color: "#000" },
            }}
          /> */}

          {/* Criteria */}
          <Box>
            <Stack
              direction="row"
            // //   justifyContent="space-between"
            //   alignItems="center"
            //   sx={{ mb: 1.5 }}
            >
              <Typography
                variant="body2"
                sx={{ color: "#000", fontWeight: 600 ,margin: "auto", marginLeft:'0px'}}
              >
                Evaluation Criteria
              </Typography>

              <Button
                size="small"
                onClick={addCriterion}
                disabled={
                  criteria.length >= AVAILABLE_CRITERIA.length
                }
              >
                + Add Criterion
              </Button>
            </Stack>

            {criteria.length === 0 && (
              <Typography
                variant="body2"
                sx={{ color: "#666", mb: 1 }}
              >
                No criteria selected.
              </Typography>
            )}

            <Stack spacing={2}>
              {criteria.map((criterion, index) => (
                <Box
                  key={index}
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="flex-start"
                    >
                      {/* Criterion Name */}
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            mb: 0.5,
                            color: "#000",
                            fontWeight: 500,
                          }}
                        >
                          Criterion
                        </Typography>

                        <Select
                          fullWidth
                          size="small"
                          displayEmpty
                          value={criterion.name}
                          onChange={(e) =>
                            handleCriterionChange(
                              index,
                              e.target.value
                            )
                          }
                          sx={{ color: "#000" }}
                        >
                          <MenuItem value="" disabled>
                            Select criterion
                          </MenuItem>

                          {getAvailableCriteria(index).map(
                            (availableCriterion) => (
                              <MenuItem
                                key={availableCriterion}
                                value={availableCriterion}
                              >
                                {availableCriterion}
                              </MenuItem>
                            )
                          )}
                        </Select>
                      </Box>

                      {/* Delete */}
                      <IconButton
                        onClick={() => removeCriterion(index)}
                        sx={{ mt: 2.5 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>

                    {/* Weight */}
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Weight"
                      value={criterion.weight ?? ""}
                      onChange={(e) =>
                        handleWeightChange(
                          index,
                          e.target.value
                        )
                      }
                      inputProps={{
                        min: 0,
                        max: 100,
                      }}
                      InputLabelProps={{
                        sx: { color: "#000" },
                      }}
                      sx={{
                        "& input": {
                          color: "#000",
                        },
                      }}
                    />

                    {/* Description */}
                    {criterion.name && (
                      <Typography
                        variant="caption"
                        sx={{ color: "#666" }}
                      >
                        {criterion.description}
                      </Typography>
                    )}
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{ color: "#000" }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            loading ||
            !name.trim() ||
            !agentId
          }
        >
          {loading
            ? "Saving..."
            : isEditing
              ? "Save Changes"
              : "Create Round"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}