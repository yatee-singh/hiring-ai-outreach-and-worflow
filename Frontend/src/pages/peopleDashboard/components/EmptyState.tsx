import { Box, Typography } from "@mui/material";

interface EmptyStateProps {
  message: string;
}

export default function EmptyState({
  message,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        py: 10,
        textAlign: "center",
      }}
    >
      <Typography
        variant="h6"
        fontWeight={600}
        sx={{ color: "#000" }}
      >
        {message}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "#777",
          mt: 1,
        }}
      >
        There is no outreach data to display yet.
      </Typography>
    </Box>
  );
}