import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import { ApplicantRoundAnalytics } from "../types";

interface Props {
  open: boolean;
  roundId: string | null;
  roundName: string;
  loadApplicants: (
    roundId: string,
    page?: number,
    pageSize?: number
  ) => Promise<any>;
  onClose: () => void;
  onViewJourney: (applicantId: string) => void;
}

const ResultChip = ({
  result,
}: {
  result: "passed" | "failed" | null;
}) => {
  if (!result) {
    return (
      <Chip
        label="Pending"
        size="small"
        variant="outlined"
        sx={{
          color: "#000",
          borderColor: "#ccc",
        }}
      />
    );
  }

  return (
    <Chip
      label={result === "passed" ? "Passed" : "Failed"}
      size="small"
      sx={{
        color: "#000",
        backgroundColor:
          result === "passed" ? "#f0f0f0" : "#e8e8e8",
        fontWeight: 600,
      }}
    />
  );
};

const RoundApplicants = ({
  open,
  roundId,
  roundName,
  loadApplicants,
  onClose,
  onViewJourney,
}: Props) => {
  const [applicants, setApplicants] = useState<
    ApplicantRoundAnalytics[]
  >([]);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 10;

  useEffect(() => {
    if (!open || !roundId) {
      return;
    }

    const fetchApplicants = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await loadApplicants(
          roundId,
          page,
          pageSize
        );

        setApplicants(response.applicants);
        setTotal(response.total);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load applicants"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [open, roundId, page, loadApplicants]);

  useEffect(() => {
    if (open) {
      setPage(1);
    }
  }, [open, roundId]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundColor: "#fff",
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "#000",
          fontWeight: 700,
          px: 3,
          pt: 3,
        }}
      >
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
              {roundName}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#666",
                mt: 0.5,
              }}
            >
              Applicant progress for this round
            </Typography>
          </Box>

          <IconButton onClick={onClose}>
            <CloseIcon sx={{ color: "#000" }} />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 3 }}>
        {loading ? (
          <Box
            sx={{
              minHeight: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress sx={{ color: "#000" }} />
          </Box>
        ) : error ? (
          <Box sx={{ py: 5, textAlign: "center" }}>
            <Typography sx={{ color: "#000", mb: 2 }}>
              {error}
            </Typography>

            <Button
              variant="outlined"
              onClick={() => setPage(page)}
              sx={{
                color: "#000",
                borderColor: "#000",
              }}
            >
              Retry
            </Button>
          </Box>
        ) : applicants.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography
              variant="body1"
              sx={{
                color: "#000",
                fontWeight: 600,
              }}
            >
              No applicants found
            </Typography>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                overflowX: "auto",
                border: "1px solid #e5e5e5",
                borderRadius: 2,
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        color: "#000",
                        fontWeight: 700,
                      }}
                    >
                      Applicant
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "#000",
                        fontWeight: 700,
                      }}
                    >
                      Call
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "#000",
                        fontWeight: 700,
                      }}
                    >
                      Score
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "#000",
                        fontWeight: 700,
                      }}
                    >
                      Result
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "#000",
                        fontWeight: 700,
                      }}
                    >
                      Evaluation
                    </TableCell>

                    <TableCell />
                  </TableRow>
                </TableHead>

                <TableBody>
                  {applicants.map((applicant) => (
                    <TableRow key={applicant.applicant_round_id}>
                      <TableCell>
                        <Typography
                          sx={{
                            color: "#000",
                            fontWeight: 600,
                          }}
                        >
                          {applicant.name || "Unnamed applicant"}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{ color: "#666" }}
                        >
                          {applicant.email || applicant.phone || "—"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={
                            applicant.called
                              ? applicant.call_status || "Called"
                              : "Not called"
                          }
                          size="small"
                          variant="outlined"
                          sx={{
                            color: "#000",
                            borderColor: "#ccc",
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography
                          sx={{
                            color: "#000",
                            fontWeight: 700,
                          }}
                        >
                          {applicant.score !== null
                            ? `${applicant.score}/${applicant.passing_score}`
                            : "—"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <ResultChip result={applicant.result} />
                      </TableCell>

                      <TableCell sx={{ maxWidth: 300 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#000",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {applicant.evaluation || "Not evaluated"}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Button
                          size="small"
                          onClick={() =>
                            onViewJourney(
                              applicant.applicant_id
                            )
                          }
                          sx={{
                            color: "#000",
                            textTransform: "none",
                            fontWeight: 600,
                          }}
                        >
                          View journey
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            {totalPages > 1 && (
              <Stack
                direction="row"
                justifyContent="center"
                sx={{ mt: 3 }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "#000",
                    },
                  }}
                />
              </Stack>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RoundApplicants;

