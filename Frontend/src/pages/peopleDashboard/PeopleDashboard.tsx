import {
    Alert,
    Box,
    CircularProgress,
    Grid,
    Stack,
  } from "@mui/material";
  
  import DashboardHeader from "./components/DashboardHeader";
  import StatsGrid from "./components/StatsGrid";
  import CandidateTable from "./components/CandidateTable";
  import LiveCalls from "./components/LiveCalls";
  import EmptyState from "./components/EmptyState";
  
  import { usePeopleDashboard } from "./hooks/usePeopleDashboard";
  import { useCampaign } from "../../hook/useCampaign";
  
  export default function PeopleDashboard() {
    const jobCampaignId = useCampaign().campaign?.id;
  
    const {
      data,
      loading,
      error,
      refresh,
    } = usePeopleDashboard(jobCampaignId);
  
    // -----------------------------------------
    // Loading
    // -----------------------------------------
  
    if (loading && !data) {
      return (
        <Box
          sx={{
            minHeight: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress
            size={32}
            sx={{ color: "#000" }}
          />
        </Box>
      );
    }
  
    // -----------------------------------------
    // Error
    // -----------------------------------------
  
    if (error) {
      return (
        <Box
          sx={{
            px: {
              xs: 2,
              sm: 3,
              md: 4,
            },
            py: 3,
          }}
        >
          <Alert
            severity="error"
            sx={{
              color: "#000",
              backgroundColor: "#f5f5f5",
              border: "1px solid #ccc",
            }}
          >
            {error}
          </Alert>
        </Box>
      );
    }
  
    // -----------------------------------------
    // Empty
    // -----------------------------------------
  
    if (!data) {
      return (
        <EmptyState message="No dashboard data found" />
      );
    }
  
    // -----------------------------------------
    // Dashboard
    // -----------------------------------------
  
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#fff",
          color: "#000",
  
          px: {
            xs: 2,
            sm: 3,
            md: 4,
            lg: 5,
          },
  
          py: {
            xs: 2.5,
            sm: 3,
            md: 4,
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1600,
            mx: "auto",
          }}
        >
          <Stack
            spacing={{
              xs: 3,
              md: 4,
            }}
          >
            {/* Header */}
            <DashboardHeader
              onRefresh={refresh}
              loading={loading}
            />
  
            {/* KPI cards */}
            <StatsGrid kpis={data.kpis} />
  
            {/* Live calls + candidates */}
            <Grid
              container
              columnSpacing={{
                xs: 0,
                md: 3,
              }}
              rowSpacing={{
                xs: 3,
                md: 0,
              }}
              
            >
              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                <LiveCalls calls={data.live_calls} />
              </Grid>
  
              <Grid
                size={{
                  xs: 12,
                  md: 8,
                }}
              >
                <CandidateTable
                  candidates={data.candidates}
                />
              </Grid>
            </Grid>
          </Stack>
        </Box>
      </Box>
    );
  }