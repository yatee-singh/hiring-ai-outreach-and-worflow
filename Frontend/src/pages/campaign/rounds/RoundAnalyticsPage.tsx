import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

import { useCampaign } from "../../../hook/useCampaign";
import { useRoundAnalytics } from "./hooks/useRoundAnalytics";

import RoundStats from "./components/RoundStats";
import RoundProgress from "./components/RoundProgress";
import RoundCard from "./components/RoundCard";
import RoundApplicants from "./components/RoundApplicants";
import ApplicantJourney from "./components/ApplicantJourney";

const RoundAnalyticsPage = () => {
  const { campaign } = useCampaign();

  const campaignId = campaign?.id;

  const {
    rounds,
    funnel,
    loading,
    error,
    refresh,
    loadApplicants,
    loadApplicantJourney,
  } = useRoundAnalytics(campaignId);

  const [selectedRoundId, setSelectedRoundId] =
    useState<string | null>(null);

  const [selectedRoundName, setSelectedRoundName] =
    useState("");

  const [journeyApplicantId, setJourneyApplicantId] =
    useState<string | null>(null);

  const selectedRoundOpen = Boolean(selectedRoundId);
  const journeyOpen = Boolean(journeyApplicantId);

  const stats = useMemo(() => {
    return rounds.reduce(
      (acc, round) => ({
        totalApplicants: Math.max(
          acc.totalApplicants,
          round.total_applicants
        ),
        totalCalled: Math.max(
          acc.totalCalled,
          round.called_count
        ),
        totalCompleted: Math.max(
          acc.totalCompleted,
          round.completed_count
        ),
        totalPassed: Math.max(
          acc.totalPassed,
          round.passed_count
        ),
      }),
      {
        totalApplicants: 0,
        totalCalled: 0,
        totalCompleted: 0,
        totalPassed: 0,
      }
    );
  }, [rounds]);

  if (!campaignId) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography
          variant="h6"
          sx={{ color: "#000", fontWeight: 700 }}
        >
          No campaign selected
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100%",
        backgroundColor: "#fafafa",
        p: {
          xs: 2,
          md: 4,
        },
      }}
    >
      <Box
        sx={{
          maxWidth: 1400,
          mx: "auto",
        }}
      >
        {/* Header */}
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                color: "#000",
                fontWeight: 700,
                letterSpacing: "-0.5px",
              }}
            >
              Hiring progress
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#666",
                mt: 0.7,
              }}
            >
              Track applicant progress across every hiring round.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={refresh}
            disabled={loading}
            sx={{
              color: "#000",
              borderColor: "#000",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              "&:hover": {
                borderColor: "#000",
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            Refresh
          </Button>
        </Stack>

        {/* Error */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              color: "#000",
              backgroundColor: "#f3f3f3",
              border: "1px solid #ddd",
            }}
          >
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading && rounds.length === 0 ? (
          <Box
            sx={{
              minHeight: 400,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress sx={{ color: "#000" }} />
          </Box>
        ) : (
          <>
            {/* Summary */}
            <RoundStats
              totalApplicants={stats.totalApplicants}
              totalCalled={stats.totalCalled}
              totalCompleted={stats.totalCompleted}
              totalPassed={stats.totalPassed}
            />

            {/* Funnel */}
            {funnel.length > 0 && (
              <Card
                elevation={0}
                sx={{
                  mt: 3,
                  border: "1px solid #e5e5e5",
                  borderRadius: 3,
                  backgroundColor: "#fff",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#000",
                      fontWeight: 700,
                      mb: 0.5,
                    }}
                  >
                    Applicant progression
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      mb: 4,
                    }}
                  >
                    See how applicants move through the hiring
                    workflow.
                  </Typography>

                  <RoundProgress rounds={funnel} />
                </CardContent>
              </Card>
            )}

            {/* Rounds */}
            <Box sx={{ mt: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  color: "#000",
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                Round performance
              </Typography>

              {rounds.length === 0 ? (
                <Card
                  elevation={0}
                  sx={{
                    border: "1px solid #e5e5e5",
                    borderRadius: 3,
                  }}
                >
                  <CardContent sx={{ py: 7, textAlign: "center" }}>
                    <Typography
                      sx={{
                        color: "#000",
                        fontWeight: 600,
                      }}
                    >
                      No rounds available
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        mt: 0.5,
                      }}
                    >
                      Add workflow rounds to start tracking
                      applicants.
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                <Grid container spacing={2}>
                  {rounds.map((round, index) => (
                    <Grid
                      item
                      xs={12}
                      md={6}
                      lg={4}
                      key={round.round_id}
                    >
                      <RoundCard
                        round={round}
                        index={index}
                        onViewApplicants={() => {
                          setSelectedRoundId(round.round_id);
                          setSelectedRoundName(
                            round.round_name
                          );
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </>
        )}
      </Box>

      {/* Applicants dialog */}
      <RoundApplicants
        open={selectedRoundOpen}
        roundId={selectedRoundId}
        roundName={selectedRoundName}
        loadApplicants={loadApplicants}
        onClose={() => {
          setSelectedRoundId(null);
        }}
        onViewJourney={(applicantId) => {
          setJourneyApplicantId(applicantId);
        }}
      />

      {/* Applicant journey */}
      <ApplicantJourney
        open={journeyOpen}
        applicantId={journeyApplicantId}
        loadApplicantJourney={loadApplicantJourney}
        onClose={() => {
          setJourneyApplicantId(null);
        }}
      />
    </Box>
  );
};

export default RoundAnalyticsPage;

