import React from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import LockIcon from "@mui/icons-material/Lock";
import { MockAgent, WorkflowRound } from "./workflowTypes";

interface Props {
  round: WorkflowRound;
  agent?: MockAgent;
  onEdit: (round: WorkflowRound) => void;
  onDelete: (round: WorkflowRound) => void;
  onRun: (round: WorkflowRound) => void;
  shouldRun: Boolean
}

const WorkflowRoundCard: React.FC<Props> = ({
  round,
  agent,
  onEdit,
  onDelete,
  onRun,
  shouldRun
}) => {
  const isRunning = round.status === "running";

  return (
    <Card
      elevation={0}
      sx={{
        width: 280,
        minWidth: 280,
        border: "1px solid #e0e0e0",
        borderRadius: 3,
        backgroundColor: "#fff",
        position: "relative",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>

          {/* Header */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                backgroundColor: "#f1f1f1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                color: "#000",
              }}
            >
              {round.order}
            </Box>

            <Stack direction="row">
              <Tooltip title="Edit round">
                <IconButton
                  size="small"
                  onClick={() => onEdit(round)}
                  disabled={isRunning}
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete round">
                <IconButton
                  size="small"
                  onClick={() => onDelete(round)}
                  disabled={isRunning}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          {/* Name */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#000",
                fontSize: "1rem",
              }}
            >
              {round.name}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#666",
                mt: 0.5,
              }}
            >
              Round {round.order}
            </Typography>
          </Box>

          {/* Agent */}
          <Box
            sx={{
              border: "1px solid #eeeeee",
              borderRadius: 2,
              p: 1.25,
              backgroundColor: "#fafafa",
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <SmartToyOutlinedIcon
                sx={{
                  fontSize: 20,
                  color: "#000",
                }}
              />

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    color: "#666",
                  }}
                >
                  Agent
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: "#000",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {agent?.name || round.agent_id}
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Passing score */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="body2"
              sx={{ color: "#555" }}
            >
              Passing score
            </Typography>

            <Chip
              label={`${round.passing_score}%`}
              size="small"
              sx={{
                color: "#000",
                backgroundColor: "#f1f1f1",
                fontWeight: 600,
              }}
            />
          </Stack>

          {/* Criteria */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "#666",
                display: "block",
                mb: 0.75,
              }}
            >
              Evaluation criteria
            </Typography>

            {round.criteria.length === 0 ? (
              <Typography
                variant="body2"
                sx={{
                  color: "#999",
                  fontSize: "0.8rem",
                }}
              >
                No criteria selected
              </Typography>
            ) : (
              <Stack
                direction="row"
                spacing={0.5}
                useFlexGap
                flexWrap="wrap"
              >
                {round.criteria.slice(0, 3).map(
                  (criterion, index) => (
                    <Chip
                      key={`${criterion.name}-${index}`}
                      label={criterion.name}
                      size="small"
                      sx={{
                        color: "#000",
                        backgroundColor: "#f5f5f5",
                        border: "1px solid #e0e0e0",
                        fontSize: "0.72rem",
                        height: 26,
                      }}
                    />
                  )
                )}

                {round.criteria.length > 3 && (
                  <Chip
                    label={`+${round.criteria.length - 3} more`}
                    size="small"
                    variant="outlined"
                    sx={{
                      color: "#666",
                      borderColor: "#ddd",
                      fontSize: "0.72rem",
                      height: 26,
                    }}
                  />
                )}
              </Stack>
            )}
          </Box>

          {/* Run / Status button */}
            {round.status === "running" ? (
              <Button
                fullWidth
                variant="contained"
                disabled
                sx={{
                  mt: 2,
                  textTransform: "none",
                  borderRadius: 2,
                  color: "#fff",
                  backgroundColor: "#000",
                }}
              >
                Running...
              </Button>
            ) : round.status === "completed" ? (
              <Button
                fullWidth
                variant="contained"
                disabled
                sx={{
                  mt: 2,
                  textTransform: "none",
                  borderRadius: 2,
                  color: "#fff",
                  backgroundColor: "#000",
                }}
              >
                Completed
              </Button>
            ) : shouldRun && round.status === "draft" ? (
              <Button
                fullWidth
                variant="contained"
                startIcon={<PlayArrowIcon />}
                onClick={() => onRun(round)}
                sx={{
                  mt: 2,
                  textTransform: "none",
                  borderRadius: 2,
                  color: "#fff",
                  backgroundColor: "#000",
                  "&:hover": {
                    backgroundColor: "#222",
                  },
                }}
              >
                Run Round
              </Button>
            ) : (
              <Button
                fullWidth
                variant="contained"
                startIcon={<LockIcon />}
                disabled
                sx={{
                  mt: 2,
                  textTransform: "none",
                  borderRadius: 2,
                  color: "#fff",
                  backgroundColor: "#000",
                }}
              >
                Locked
              </Button>
            )}
          

        </Stack>
      </CardContent>
    </Card>
  );
};

export default WorkflowRoundCard;