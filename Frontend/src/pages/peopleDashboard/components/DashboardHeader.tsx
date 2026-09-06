import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

interface DashboardHeaderProps {
  onRefresh: () => void;
  loading?: boolean;
}

export default function DashboardHeader({
  onRefresh,
  loading = false,
}: DashboardHeaderProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      mb={4}
    >
      <Box>
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ color: "#000" }}
        >
          People
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#555",
            mt: 0.5,
          }}
        >
          Monitor candidate outreach and call performance
        </Typography>
      </Box>

      <Button
        variant="outlined"
        startIcon={<RefreshIcon />}
        onClick={onRefresh}
        disabled={loading}
        sx={{
          color: "#000",
          borderColor: "#000",
          textTransform: "none",
          borderRadius: 2,
          "&:hover": {
            borderColor: "#000",
            backgroundColor: "#f5f5f5",
          },
          margin:"auto",
          mr:"0"
        }}
      >
        Refresh
      </Button>
    </Stack>
  );
}