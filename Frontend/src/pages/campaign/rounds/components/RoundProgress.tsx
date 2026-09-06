import {
  Box,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import { RoundFunnelItem } from "../types";

interface Props {
  rounds: RoundFunnelItem[];
}

const MetricRow = ({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) => {
  const percentage =
    total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 0.7 }}
      >
        <Typography
          variant="body2"
          sx={{ color: "#000", fontWeight: 500 }}
        >
          {label}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "#000", fontWeight: 600 }}
        >
          {value} · {percentage}%
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 7,
          borderRadius: 10,
          backgroundColor: "#eeeeee",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#000",
            borderRadius: 10,
          },
        }}
      />
    </Box>
  );
};

const RoundProgress = ({ rounds }: Props) => {
  return (
    <Stack spacing={4}>
      {rounds.map((round, index) => (
        <Box key={round.round_id}>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "1px solid #000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#000",
                  fontWeight: 700,
                }}
              >
                {index + 1}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#000",
                  fontWeight: 700,
                }}
              >
                {round.round_name}
              </Typography>

              <Typography
                variant="caption"
                sx={{ color: "#555" }}
              >
                {round.total} applicants
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={1.8} sx={{ pl: 5.5 }}>
            <MetricRow
              label="Called"
              value={round.called}
              total={round.total}
            />

            <MetricRow
              label="Completed"
              value={round.completed}
              total={round.total}
            />

            <MetricRow
              label="Evaluated"
              value={round.evaluated}
              total={round.total}
            />

            <MetricRow
              label="Passed"
              value={round.passed}
              total={round.total}
            />
          </Stack>
        </Box>
      ))}
    </Stack>
  );
};

export default RoundProgress;

