import {
    Card,
    CardContent,
    Link,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
  } from "@mui/material";
  
  import type { Candidate } from "../types";
  import CallStatusChip from "./CallStatusChip";
  
  interface CandidateTableProps {
    candidates: Candidate[];
  }
  
  export default function CandidateTable({
    candidates,
  }: CandidateTableProps) {
    return (
      <Card
        elevation={0}
        sx={{
          border: "1px solid #e0e0e0",
          borderRadius: 3,
          backgroundColor: "#fff",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              color: "#000",
              p: 3,
              pb: 2,
            }}
          >
            Top Candidates
          </Typography>
  
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#fafafa",
                  }}
                >
                  <TableCell sx={{ fontWeight: 700, color: "#000" }}>
                    Candidate
                  </TableCell>
  
                  <TableCell sx={{ fontWeight: 700, color: "#000" }}>
                    Job Title
                  </TableCell>
  
                  <TableCell sx={{ fontWeight: 700, color: "#000" }}>
                    Company
                  </TableCell>
  
                  <TableCell sx={{ fontWeight: 700, color: "#000" }}>
                    Location
                  </TableCell>
  
                  <TableCell sx={{ fontWeight: 700, color: "#000" }}>
                    Phone
                  </TableCell>
  
                  <TableCell sx={{ fontWeight: 700, color: "#000" }}>
                    Call Status
                  </TableCell>
  
                  <TableCell sx={{ fontWeight: 700, color: "#000" }}>
                    LinkedIn
                  </TableCell>
                </TableRow>
              </TableHead>
  
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow
                    key={candidate.id}
                    hover
                    sx={{
                      "&:last-child td": {
                        borderBottom: 0,
                      },
                    }}
                  >
                    <TableCell>
                      <Typography
                        fontWeight={600}
                        sx={{ color: "#000" }}
                      >
                        {candidate.name || "Unknown"}
                      </Typography>
                    </TableCell>
  
                    <TableCell sx={{ color: "#333" }}>
                      {candidate.job_title || "—"}
                    </TableCell>
  
                    <TableCell sx={{ color: "#333" }}>
                      {candidate.company || "—"}
                    </TableCell>
  
                    <TableCell sx={{ color: "#333" }}>
                      {candidate.location || "—"}
                    </TableCell>
  
                    <TableCell sx={{ color: "#333" }}>
                      {candidate.phone || "—"}
                    </TableCell>
  
                    <TableCell>
                      <CallStatusChip
                        status={candidate.call_status}
                      />
                    </TableCell>
  
                    <TableCell>
                      {candidate.linkedin_url ? (
                        <Link
                          href={candidate.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                          sx={{
                            color: "#000",
                            fontWeight: 500,
                          }}
                        >
                          View
                        </Link>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
  
                {candidates.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      align="center"
                      sx={{
                        py: 6,
                        color: "#666",
                      }}
                    >
                      No candidates found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
  }