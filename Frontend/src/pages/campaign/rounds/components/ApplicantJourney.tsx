import { useEffect, useState } from "react";

import {
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import { ApplicantJourneyResponse } from "../types";

interface Props {
  open: boolean;
  applicantId: string | null;

  loadApplicantJourney: (
    applicantId: string
  ) => Promise<ApplicantJourneyResponse>;

  onClose: () => void;
}

const ApplicantJourney = ({
  open,
  applicantId,
  loadApplicantJourney,
  onClose,
}: Props) => {
  const [data, setData] =
    useState<ApplicantJourneyResponse | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !applicantId) {
      return;
    }

    const load = async () => {
      setLoading(true);

      try {
        const response =
          await loadApplicantJourney(applicantId);

        setData(response);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [open, applicantId, loadApplicantJourney]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ px: 3, pt: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: "#000",
                fontWeight: 700,
              }}
            >
              {data?.applicant_name || "Applicant journey"}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#666",
                mt: 0.5,
              }}
            >
              Round-by-round progress
            </Typography>
          </Box>

          <IconButton onClick={onClose}>
            <CloseIcon sx={{ color: "#000" }} />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 4 }}>
        {loading ? (
          <Box
            sx={{
              height: 300,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress sx={{ color: "#000" }} />
          </Box>
        ) : !data || data.rounds.length === 0 ? (
          <Box sx={{ py: 5, textAlign: "center" }}>
            <Typography sx={{ color: "#000" }}>
              No round information available.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={0}>
            {data.rounds.map((round, index) => {
              const isLast =
                index === data.rounds.length - 1;

              return (
                <Box
                  key={round.round_id}
                  sx={{
                    display: "flex",
                    gap: 2,
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      width: 34,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        backgroundColor: "#000",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 13,
                        zIndex: 1,
                      }}
                    >
                      {index + 1}
                    </Box>

                    {!isLast && (
                      <Box
                        sx={{
                          width: 1,
                          flex: 1,
                          backgroundColor: "#ddd",
                          minHeight: 70,
                        }}
                      />
                    )}
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      pb: isLast ? 0 : 3,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Box>
                        <Typography
                          sx={{
                            color: "#000",
                            fontWeight: 700,
                          }}
                        >
                          {round.round_name}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{ color: "#666" }}
                        >
                          {round.status}
                        </Typography>
                      </Box>

                      {round.result && (
                        <Chip
                          label={
                            round.result === "passed"
                              ? "Passed"
                              : "Failed"
                          }
                          size="small"
                          sx={{
                            color: "#000",
                            backgroundColor: "#f0f0f0",
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Stack>

                    <Box
                      sx={{
                        mt: 1.5,
                        p: 2,
                        border: "1px solid #e5e5e5",
                        borderRadius: 2,
                      }}
                    >
                      <Stack
                        direction={{
                          xs: "column",
                          sm: "row",
                        }}
                        spacing={3}
                      >
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{ color: "#666" }}
                          >
                            Call
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color: "#000",
                              fontWeight: 600,
                            }}
                          >
                            {round.called
                              ? round.call_status ||
                                "Called"
                              : "Not called"}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography
                            variant="caption"
                            sx={{ color: "#666" }}
                          >
                            Score
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color: "#000",
                              fontWeight: 600,
                            }}
                          >
                            {round.score !== null
                              ? `${round.score}/${round.passing_score}`
                              : "—"}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography
                            variant="caption"
                            sx={{ color: "#666" }}
                          >
                            Evaluation
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color: "#000",
                              fontWeight: 600,
                            }}
                          >
                            {round.evaluation ||
                              "Not evaluated"}
                          </Typography>
                        </Box>
                      </Stack>

                      {round.call_summary && (
                        <>
                          <Divider sx={{ my: 1.5 }} />

                          <Typography
                            variant="caption"
                            sx={{
                              color: "#666",
                              display: "block",
                              mb: 0.5,
                            }}
                          >
                            Call summary
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color: "#000",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {JSON.stringify(
                              round.call_summary,
                              null,
                              2
                            )}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplicantJourney;
