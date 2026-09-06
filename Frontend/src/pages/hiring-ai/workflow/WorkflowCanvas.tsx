import React from "react";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import WorkflowRoundCard from "./WorkflowRoundCard";
import {
  MockAgent,
  WorkflowRound,
} from "./workflowTypes";

interface Props {
  rounds: WorkflowRound[];
  agents: MockAgent[];
  onAdd: () => void;
  onEdit: (round: WorkflowRound) => void;
  onDelete: (round: WorkflowRound) => void;
  onRun: (round: WorkflowRound) => void;
}

const WorkflowCanvas: React.FC<Props> = ({
  rounds,
  agents,
  onAdd,
  onEdit,
  onDelete,
  onRun
}) => {
  if (rounds.length === 0) {
    return (
      <Box
        sx={{
          minHeight: 360,
          border: "1px dashed #d5d5d5",
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fafafa",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#000",
            fontWeight: 600,
            mb: 1,
          }}
        >
          No rounds yet
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#666",
            mb: 2,
          }}
        >
          Add your first round to build the workflow.
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{
            textTransform: "none",
            color: "#fff",
            backgroundColor: "#000",
            "&:hover": {
              backgroundColor: "#222",
            },
          }}
        >
          Add round
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        border: "1px solid #e5e5e5",
        borderRadius: 3,
        backgroundColor: "#fafafa",
        p: 3,
        overflowX: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          minWidth: "max-content",
          py: 4,
        }}
      >
        {rounds.map((round, index) => {
          const agent = agents.find(
            (item) => item.id === round.agent_id
          );

          const shouldRun =
            round.status === "draft" &&
            (
              index === 0 ||
              rounds[index - 1]?.status === "completed"
            );

          return (
            <React.Fragment key={round.id}>
              <WorkflowRoundCard
                round={round}
                agent={agent}
                onEdit={onEdit}
                onDelete={onDelete}
                onRun={onRun}
                shouldRun={shouldRun}
              />

              {index < rounds.length - 1 && (
                <ArrowForwardIcon
                  sx={{
                    mx: 2,
                    color: "#999",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{
            ml: 2,
            minWidth: 130,
            height: 42,
            textTransform: "none",
            color: "#000",
            borderColor: "#bbb",
            backgroundColor: "#fff",
            "&:hover": {
              borderColor: "#000",
              backgroundColor: "#fff",
            },
          }}
        >
          Add round
        </Button>
      </Box>
    </Box>
  );
};

export default WorkflowCanvas;