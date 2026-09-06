import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

import type { LiveCall } from "../types";

interface LiveCallsProps {
  calls: LiveCall[];
}

export default function LiveCalls({
  calls,
}: LiveCallsProps) {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 3,
        backgroundColor: "#fff",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          mb={2}
        >
          <PhoneInTalkIcon sx={{ color: "#000" }} />

          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ color: "#000" }}
          >
            Live Calls
          </Typography>
        </Stack>

        {calls.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ color: "#777" }}
          >
            No calls currently in progress.
          </Typography>
        ) : (
          <Stack spacing={1.5}>
            {calls.map((call) => (
              <Box
                key={call.candidate_id}
                sx={{
                  border: "1px solid #e5e5e5",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      fontWeight={600}
                      sx={{ color: "#000" }}
                    >
                      {call.name || "Unknown"}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ color: "#666", mt: 0.5 }}
                    >
                      {call.phone || "No phone"}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ color: "#000" }}
                  >
                    {call.status || "Calling"}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}