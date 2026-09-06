import {
    Chip,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
    Typography,
  } from "@mui/material";
  
  import OpenInNewIcon from "@mui/icons-material/OpenInNew";
  
  import { useState } from "react";
  import { Applicant } from "../types";
  
  interface Props {
    applicants: Applicant[];
  }
  
  function getStatusStyles(status: string) {
    switch (status.toLowerCase()) {
      case "shortlisted":
        return {
          backgroundColor: "#dcfce7",
          color: "#166534",
        };
  
      case "rejected":
        return {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
        };
  
      case "interview":
        return {
          backgroundColor: "#dbeafe",
          color: "#1e40af",
        };
  
      case "hired":
        return {
          backgroundColor: "#ede9fe",
          color: "#5b21b6",
        };
  
      default:
        return {
          backgroundColor: "#f3f4f6",
          color: "#374151",
        };
    }
  }
  
  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  
  export default function ApplicantTable({ applicants }: Props) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
  
    const paginatedApplicants = applicants.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  
    return (
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #e5e7eb",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#f9fafb",
                }}
              >
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
                  Contact
                </TableCell>
  
                <TableCell
                  sx={{
                    color: "#000",
                    fontWeight: 700,
                  }}
                >
                  Status
                </TableCell>
  
                <TableCell
                  sx={{
                    color: "#000",
                    fontWeight: 700,
                  }}
                >
                  Applied On
                </TableCell>
  
                <TableCell
                  align="right"
                  sx={{
                    color: "#000",
                    fontWeight: 700,
                  }}
                >
                  Resume
                </TableCell>
              </TableRow>
            </TableHead>
  
            <TableBody>
              {paginatedApplicants.map((applicant) => (
                <TableRow
                  key={applicant.id}
                  hover
                  sx={{
                    "&:last-child td": {
                      borderBottom: 0,
                    },
                  }}
                >
                  {/* Applicant */}
                  <TableCell>
                    <Typography
                      sx={{
                        color: "#000",
                        fontWeight: 600,
                      }}
                    >
                      {applicant.name}
                    </Typography>
  
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#555",
                      }}
                    >
                      ID: {applicant.id.slice(0, 8)}
                    </Typography>
                  </TableCell>
  
                  {/* Contact */}
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: "#000" }}
                    >
                      {applicant.email || "No email"}
                    </Typography>
  
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#555",
                        mt: 0.25,
                      }}
                    >
                      {applicant.phone}
                    </Typography>
                  </TableCell>
  
                  {/* Status */}
                  <TableCell>
                    <Chip
                      label={applicant.status}
                      size="small"
                      sx={{
                        ...getStatusStyles(applicant.status),
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    />
                  </TableCell>
  
                  {/* Date */}
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: "#000" }}
                    >
                      {formatDate(applicant.created_at)}
                    </Typography>
                  </TableCell>
  
                  {/* Resume */}
                  <TableCell align="right">
                    {applicant.resume_url ? (
                      <Tooltip title="Open resume">
                        <IconButton
                          component="a"
                          href={applicant.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: "#000",
                          }}
                        >
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#777",
                        }}
                      >
                        —
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
  
              {paginatedApplicants.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ py: 8 }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#000",
                        fontWeight: 600,
                      }}
                    >
                      No applicants found
                    </Typography>
  
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        mt: 0.5,
                      }}
                    >
                      Try changing your search or filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
  
        <TablePagination
          component="div"
          count={applicants.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          sx={{
            color: "#000",
          }}
        />
      </Paper>
    );
  }