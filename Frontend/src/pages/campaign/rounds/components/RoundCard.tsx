import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import { RoundAnalytics } from "../types";

interface Props {
  round: RoundAnalytics;
  index: number;
  onViewApplicants: () => void;
}

const Metric = ({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) => (
  <Box>
    <Typography
      variant="caption"
      sx={{
        display: "block",
        color: "#666",
        mb: 0.4,
      }}
    >
      {label}
    </Typography>

    <Typography
      variant="body1"
      sx={{
        color: "#000",
        fontWeight: 700,
      }}
    >
      {value}
    </Typography>
  </Box>
);

const RoundCard = ({
  round,
  index,
  onViewApplicants,
}: Props) => {
  const passRate =
    round.scored_count > 0
      ? Math.round(
          (round.passed_count / round.scored_count) * 100
        )
      : 0;

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid #e4e4e4",
        borderRadius: 3,
        backgroundColor: "#fff",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "#000",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "#666",
                fontWeight: 600,
              }}
            >
              ROUND {index + 1}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "#000",
                fontWeight: 700,
                mt: 0.5,
              }}
            >
              {round.round_name}
            </Typography>
          </Box>

          <Box
            sx={{
              px: 1.2,
              py: 0.5,
              border: "1px solid #ddd",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#000",
                fontWeight: 700,
              }}
            >
              {passRate}% pass
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Metric
              label="Applicants"
              value={round.total_applicants}
            />

            <Metric
              label="Called"
              value={round.called_count}
            />

            <Metric
              label="Completed"
              value={round.completed_count}
            />
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Metric
              label="Evaluated"
              value={round.evaluated_count}
            />

            <Metric
              label="Passed"
              value={round.passed_count}
            />

            <Metric
              label="Failed"
              value={round.failed_count}
            />
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Metric
              label="Avg. score"
              value={
                round.average_score !== null
                  ? round.average_score.toFixed(1)
                  : "—"
              }
            />

            <Metric
              label="Passing score"
              value={
                round.passing_score !== null
                  ? round.passing_score
                  : "—"
              }
            />
          </Stack>
        </Stack>

        <Button
          fullWidth
          variant="outlined"
          onClick={onViewApplicants}
          sx={{
            mt: 2.5,
            borderColor: "#000",
            color: "#000",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            "&:hover": {
              borderColor: "#000",
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          View applicants
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoundCard;

